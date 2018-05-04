import {TypedMap} from '../utils/objects'
import {addToConstructorQueue, AnyWidget, EnhancedConstructor} from './construct'

export const TransformerRegistry: TypedMap<Function> = {
    arrayidentity: () => () => true
}

export const Transformer = () => (proto: AnyWidget, method: string) => {
    addToConstructorQueue(proto.constructor as EnhancedConstructor, (widget: AnyWidget) => {
        TransformerRegistry[method] = widget[method].bind(widget)
    })
}
