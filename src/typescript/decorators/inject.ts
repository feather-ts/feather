import {addToConstructorQueue, AnyWidget, EnhancedConstructor, Singletons} from './construct'
import {isDef} from '../utils/functions'

export const Inject = () => (proto: AnyWidget, property: string) => {
    addToConstructorQueue(proto.constructor as EnhancedConstructor, (widget: AnyWidget) => {
        const singleton = Singletons[property]
        if (isDef(singleton)) {
            widget[property] = singleton
        }
    })
}
