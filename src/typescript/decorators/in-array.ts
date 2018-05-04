import {ArrayWidget} from './construct'
import {ensure} from '../utils/objects'

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
