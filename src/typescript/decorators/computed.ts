import {createObjectPropertyListener, ensure, TypedMap} from '../utils/objects'

const computedProps = new WeakMap<any, TypedMap<string[]>>()

export const createComputedListener = (widget, info, updateDom: Function) => {
    const proto = Object.getPrototypeOf(widget)
    if (!computedProps.has(proto) || !computedProps.get(proto)[info.path()]) {
        throw Error('Bound functions must be decorated with @Computed(...paths: string[])')
    }
    computedProps.get(proto)[info.path()].forEach(prop =>
        createObjectPropertyListener(widget, prop, () => updateDom())
    )
}

export const Computed = (...paths: string[]) => (proto: any, method: string) => {
    ensure(computedProps, proto, {[method]: paths})
}
