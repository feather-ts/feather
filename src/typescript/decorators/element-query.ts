import {addToRenderQueue, AnyWidget, EnhancedConstructor} from './construct'
import {registerCleanUp} from '../core/cleanup'

const changeEvents = ['resize']
const options = {passive: true}

export const ElementQuery = (query: string) => (proto: AnyWidget, method: string) => {
    const func = new Function('node', `with (node) {return (${query})}`)
    const changeHandler = (widget, node) => {
        return () => {
            if (func(node)) {
                widget[method](node)
            }
        }
    }
    addToRenderQueue(proto.constructor as EnhancedConstructor, (widget: AnyWidget, node: Node) => {
        const handler = changeHandler(widget, node)
        changeEvents.forEach(event => window.addEventListener(event, handler, options as any))
        registerCleanUp(node, () => changeEvents.forEach(event => window.removeEventListener(event, handler, options as any)))
        handler()
    })
}
