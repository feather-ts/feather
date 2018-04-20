import {isDef, isFunction, isUndef} from '../utils/functions'
import {addToConstructorQueue, AnyWidget, ArrayWidget, EnhancedConstructor, Widget} from './construct'
import {addPropertyListener, Callback, ensure, getSubset, TypedMap} from '../utils/objects'
import {observeArray} from '../utils/arrays'

const localStorageProperties = new WeakMap<any, string[]>()
const storableProperties = new WeakMap<any, string[]>()

const widgetId = (widget: any): string => {
    const id = widget.id || widget.name || widget.title || widget.constructor.name
    return isFunction(id) ? id() : id
}

const store = (key, value) => {
    window.localStorage.setItem(key, JSON.stringify({value}))
}

const load = (key) => {
    const json = window.localStorage.getItem(key)
    if (json) {
        return JSON.parse(json).value
    }
}

const loadArray = (key: string, proto: any) => {
    const props = storableProperties.get(proto)
    const arr = load(key)
    if (!arr || isUndef(props)) {
        return
    }
    return arr.map(i =>
        props.reduce(
            (p, c) => {
                p[c] = i[c]
                return p
            },
            new (Function.prototype.bind.apply(proto))
        )
    )
}

const storeArray = (key: string, arr: any[], proto: any) => {
    const props = storableProperties.get(proto)
    if(isUndef(props)) {
        throw Error('@LocalStorage array items must have at least one @Storable() property')
    }
    const value = arr.map(i => getSubset(props, i))
    setTimeout(() => store(key, value), 80)
}

const storeListener = (arr: ArrayWidget[], callback: Callback) => {
    const listener = {
        sort: callback,
        splice: (i, d, a) => {
            if (a.length) {
                a.forEach(item => {
                    const proto = Object.getPrototypeOf(item),
                          props = storableProperties.get(proto.constructor)
                    props.forEach(prop => {
                        addPropertyListener(item, prop, callback)
                    })
                })
            }
            if (a.length || d > 0) {
                callback()
            }
        }
    }
    observeArray(arr, listener)
    listener.splice(0, 0, arr)
}

const handler = (arrayType?: () => ArrayWidget) => (widget: AnyWidget) => {
    const props = localStorageProperties.get(Object.getPrototypeOf(widget))
    if (props) {
        props.forEach(prop => {
            const storeKey = widgetId(widget) + '.' + prop
            let value = widget[prop]
            if (Array.isArray(value)) {
                const type = isDef(arrayType) ? arrayType() : undefined
                if (isUndef(type)) {
                    throw Error('Stored arrays need an arrayType argument')
                }
                try {
                    const tryValue = loadArray(storeKey, type)
                    if (isDef(tryValue)) {
                        value = widget[prop] = tryValue
                    }
                } catch (e) {
                    console.warn('LocalStorage loading failed...ignoring')
                    // format changed or something else failed
                }
                storeListener(value, () => {
                    storeArray(storeKey, value, type)
                })
            } else  {
                const tryValue = load(storeKey)
                if (isDef(tryValue)) {
                    widget[prop] = tryValue
                }
                addPropertyListener(widget, prop, () => {
                    store(storeKey, widget[prop])
                })
            }
        })
    }
}

export const LocalStorage = (arrayType?: () => ArrayWidget) => (proto: Widget, property: string) => {
    ensure(localStorageProperties, proto, [property])
    addToConstructorQueue(proto.constructor as EnhancedConstructor, handler(arrayType))
}

export const Storable = () => (proto: ArrayWidget, property: string) => {
    ensure(storableProperties, proto.constructor, [property])
}
