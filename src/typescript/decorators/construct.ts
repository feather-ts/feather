import {registerCleanUp} from '../core/cleanup'
import {decapitalize} from '../utils/strings'
import {ensure} from '../utils/objects'
import {removeFromArray} from '../utils/arrays'

export const MOUNT_EVENT = '__mounted__'

export const ConstructRegistry: { [key: string]: {} } = {}
export const Singletons: { [key: string]: {} } = {}

export interface ConstructConf {
    selector: string
    singleton?: true
}

export interface EnhancedConstructor extends Function {
    queue: Function[]
}

export interface Widget {
    init: (el: Element) => void
}

export interface ArrayWidget {
}

export type AnyWidget = Widget | ArrayWidget

export const start = (root: Element | DocumentFragment = document.documentElement): Widget[] => {
    const createdWidgets = []
    Object.keys(ConstructRegistry).forEach(selector => {
        Array.from(root.querySelectorAll(selector)).forEach(node => {
            const widget = new (Function.prototype.bind.apply(ConstructRegistry[selector]))
            runConstructorQueue(widget, node)
            createdWidgets.push(widget)
            runAfterDomMount(node)
        })
    })
    return createdWidgets
}

export const Construct = (conf: ConstructConf) => (proto: any) => {
    ConstructRegistry[conf.selector] = proto as Widget
    addToConstructorQueue(proto as EnhancedConstructor, (widget: Widget, node: Element) => {
        if (conf.singleton === true) {
            const name = decapitalize(widget.constructor.name)
            Singletons[name] = widget
            registerCleanUp(node, () => {
                delete Singletons[name]
            })
        }
        widget.init(node)
    })
}

const queue = new WeakMap<EnhancedConstructor, Function[]>()

export const addToConstructorQueue = (constructor: EnhancedConstructor, func: Function) => {
    ensure(queue, constructor, [func])
}

interface AfterRenderCallback {
    node: Element,
    function: Function
}

const afterRenderQueue: AfterRenderCallback[] = []

export const addToAfterMount = (constructor: EnhancedConstructor, func: Function) => {
    addToConstructorQueue(constructor, (widget, node) => {
        const callback = {
            node,
            function: () => func(widget, node)
        }
        afterRenderQueue.push(callback)
        registerCleanUp(node, () => removeFromArray(afterRenderQueue, [callback]))
    })
}

export const runAfterDomMount = (root: Node) => {
    afterRenderQueue.forEach(cb => {
        if (root.contains(cb.node)) {
            cb.function()
        }
    })
}


export const runConstructorQueue = (widget: AnyWidget, node: Node) => {
    const widgetQueue = queue.get(Object.getPrototypeOf(widget).constructor) || []
    for (let i = 0, n = widgetQueue.length; i < n; i++) { // for performance
        widgetQueue[i].call(widget, widget, node)
    }
}


