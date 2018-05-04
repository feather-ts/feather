import {addToRenderQueue, AnyWidget, EnhancedConstructor} from './construct'

export const TemplateNode = (selector: string) => (proto: AnyWidget, property: string) => {
    addToRenderQueue(proto.constructor as EnhancedConstructor, (widget, node) => {
        console.log(node.outerHTML, selector, property)
        widget[property] = node.querySelector(selector)
    })
}
