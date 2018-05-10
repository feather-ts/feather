import {addToAfterMount, AnyWidget, EnhancedConstructor} from './construct'

export const AfterMount = () => (proto: AnyWidget, method: string) => {
    addToAfterMount(proto.constructor as EnhancedConstructor, (widget: AnyWidget, node: Element) => {
        if (document.documentElement.contains(node)) {
            widget[method](node)
        }
    })
}
