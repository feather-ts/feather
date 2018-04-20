import {addToConstructorQueue, AnyWidget, EnhancedConstructor} from './construct'
import {isDef, isUndef} from '../utils/functions'
import {registerCleanUp} from '../core/cleanup'

export enum Scope {
    Direct,
    Delegate,
    UntilMatch
}

export interface EventConfig {
    event?: string | string[]
    preventDefault?: boolean
    selector?: string
    scope?: Scope
    options?: boolean | AddEventListenerOptions
}

interface BoundEventConfig extends EventConfig {
    method: string
}

function preventDefault(conf: BoundEventConfig, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) {
    if (conf.preventDefault === true) {
        ev.preventDefault()
    }
}

const createHandler =
    (event: string, conf: BoundEventConfig, widget: AnyWidget, node: Element, direct: boolean) =>
    (ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => {
        if (direct) {
            preventDefault(conf, ev)
            widget[conf.method].call(widget, ev, node)
        } else {
            let el = ev.target as HTMLElement
            do {
                if (el.nodeType === Node.ELEMENT_NODE && el.matches(conf.selector)) {
                    preventDefault(conf, ev)
                    return widget[conf.method].call(widget, ev, el)
                }
                if (el === node && conf.scope !== Scope.UntilMatch) {
                    break
                }
            } while (el = el.parentElement)
        }
    }

const attachEvents = (conf) => (widget: AnyWidget, node: Element) => {
    const events = Array.isArray(conf.event) ? conf.event : [conf.event]
    events.forEach(event => {
        if (Scope.Direct && isDef(conf.selector)) {
            node = node.querySelector(conf.selector)
        }
        const handler = createHandler(
            event,
            conf,
            widget,
            node,
            conf.scope === Scope.Direct || isUndef(conf.selector)
        )
        node.addEventListener(event, handler, conf.options as any)
        registerCleanUp(node, () => node.removeEventListener(event, handler))
    })
}

export const On = (conf: EventConfig) => (proto: AnyWidget, method: string) => {
    const finalConf = {...conf, method: method, event: conf.event || method, scope: Scope.Delegate}
    addToConstructorQueue(proto.constructor as EnhancedConstructor, attachEvents(finalConf))
}
