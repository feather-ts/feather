import {addToRenderQueue, AnyWidget, EnhancedConstructor} from './construct'
import {registerCleanUp} from '../core/cleanup'

const options = {passive: true}

export const ElementQuery = (query: string, ...events: string[]) => (proto: AnyWidget, method: string) => {
    if (!events || events.length === 0) {
        events = ['resize']
    }
    const func = new Function('node', `with (node) {return (${query})}`)
    const changeHandler = (widget, node) => {
        return (ev) => {
            if (func(node)) {
                widget[method](ev, node)
            }
        }
    }
    addToRenderQueue(proto.constructor as EnhancedConstructor, (widget: AnyWidget, node: Node) => {
        const handler = changeHandler(widget, node)
        events.forEach(event => window.addEventListener(event, handler, options as any))
        registerCleanUp(node, () => events.forEach(event => window.removeEventListener(event, handler, options as any)))
        handler(null)
    })
}
