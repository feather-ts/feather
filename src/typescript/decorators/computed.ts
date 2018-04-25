import {createObjectPropertyListener, ensure, TypedMap} from '../utils/objects'
import {AnyWidget} from './construct'

const computedProps = new WeakMap<AnyWidget, TypedMap<string[]>>()

export const createComputedListener = (widget, info, updateDom: Function) => {
    const proto = Object.getPrototypeOf(widget)
    if (!computedProps.has(proto) || !computedProps.get(proto)[info.path()]) {
        throw Error('Bound functions must be decorated with @Computed(...paths: string[])')
    }
    computedProps.get(proto)[info.path()].forEach(prop =>
        createObjectPropertyListener(widget, prop, () => updateDom())
    )
}

export const Computed = (...paths: string[]) => (proto: AnyWidget, method: string) => {
    ensure(computedProps, proto, {[method]: paths})
}
