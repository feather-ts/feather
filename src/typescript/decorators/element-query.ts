import {addToRenderQueue, AnyWidget, EnhancedConstructor} from './construct'
import {registerCleanUp} from '../core/cleanup'

const options = {passive: true}

const changeHandler = (widget, node, method, fn) => {
    let old
    return (ev) => {
        const res = fn(node)
        if (!old && res) {
            old = true
            widget[method](ev, node)
        } else if (!res) {
            old = false
        }
    }
}

export const ElementQuery = (fn: (element: Element) => boolean, ...events: string[]) => (proto: AnyWidget, method: string) => {
    if (!events || events.length === 0) {
        events = ['resize']
    }
    addToRenderQueue(proto.constructor as EnhancedConstructor, (widget: AnyWidget, node: Node) => {
        const handler = changeHandler(widget, node, method, fn)
        events.forEach(event => window.addEventListener(event, handler, options as any)) // change this to have only one window event
        registerCleanUp(node, () => events.forEach(event => window.removeEventListener(event, handler, options as any)))
        handler(null)
    })
}
