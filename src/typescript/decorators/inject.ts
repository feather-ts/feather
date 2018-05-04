import {addToConstructorQueue, AnyWidget, ArrayWidget, EnhancedConstructor, Singletons} from './construct'
import {isDef} from '../utils/functions'
import {ensure} from '../utils/objects'

export const Inject = () => (proto: AnyWidget, property: string) => {
    addToConstructorQueue(proto.constructor as EnhancedConstructor, (widget: AnyWidget) => {
        const singleton = Singletons[property]
        if (isDef(singleton)) {
            widget[property] = singleton
        }
    })
}

const inArray = new WeakMap<ArrayWidget, string>()

export const InArray = () => (proto: ArrayWidget, property: string) => {
    ensure(inArray, proto, property)
}

export const injectArray = (widget: ArrayWidget, array: ArrayWidget[]) => {
    const proto = Object.getPrototypeOf(widget)
    if (inArray.has(proto)) {
        widget[inArray.get(proto)] = array
    }
}
