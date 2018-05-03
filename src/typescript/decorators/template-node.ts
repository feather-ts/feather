import {addToRenderQueue, ArrayWidget, EnhancedConstructor} from './construct'

export const TemplateNode = (selector: string) => (proto: ArrayWidget, property: string) => {
    addToRenderQueue(proto.constructor as EnhancedConstructor, (widget, node) => {
        widget[property] = node.querySelector(selector)
    })
}
