import {addToRenderQueue, AnyWidget, EnhancedConstructor} from './construct'

export const TemplateNode = (selector: string) => (proto: AnyWidget, property: string) => {
    addToRenderQueue(proto.constructor as EnhancedConstructor, (widget, node) => {
        widget[property] = node.querySelector(selector)
    })
}
