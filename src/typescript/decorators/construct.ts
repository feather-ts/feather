import {registerCleanUp} from '../core/cleanup'
import {decapitalize} from '../utils/strings'
import {ensure} from '../utils/objects'

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
const renderQueue = new WeakMap<EnhancedConstructor, Function[]>()

export const addToConstructorQueue = (constructor: EnhancedConstructor, func: Function) => {
    ensure(queue, constructor, [func])
}

export const addToRenderQueue = (constructor: EnhancedConstructor, func: Function) => {
    ensure(renderQueue, constructor, [func])
}

export const runConstructorQueue = (widget: AnyWidget, node: Node) => {
    const widgetQueue = queue.get(Object.getPrototypeOf(widget).constructor) || []
    for (let i = 0, n = widgetQueue.length; i < n; i++) { // for performance
        widgetQueue[i].call(widget, widget, node)
    }
}

export const runAfterRenderQueue = (widget: AnyWidget, nodes: Node[]) => {
    const widgetQueue = renderQueue.get(Object.getPrototypeOf(widget).constructor) || []
    for (let i = 0, n = widgetQueue.length; i < n; i++) { // for performance use for-loops
        for (let m = 0, l = nodes.length; m < l; m++) {
            setTimeout(() => widgetQueue[i].call(widget, widget, nodes[m]), 0)
        }
    }
}


