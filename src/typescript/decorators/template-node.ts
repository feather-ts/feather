import {addToAfterMount, AnyWidget, EnhancedConstructor} from './construct'
import {isUndef} from '../utils/functions'

export const TemplateNode = (selector: string) => (proto: AnyWidget, property: string) => {
    addToAfterMount(proto.constructor as EnhancedConstructor, (widget, node) => {
        if (isUndef(widget[property])) {
            widget[property] = node.querySelector(selector)
        }
    })
}
