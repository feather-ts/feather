import {AnyWidget} from '../decorators/construct'

export type TypedMap<T> = { [key: string]: T }
export type Callback = () => void
export type PropertyCallback = (property: string) => void
export type WidgetClass<T extends AnyWidget> = { new (...args: any[]): T }

export const pathCallbacks = new WeakMap<any, TypedMap<Array<Callback>>>()

export const getSubset = (keys: string[], obj: {}) =>
    keys.reduce((a, c) => ({ ...a, [c]: obj[c] }), {})

export const isObject = (obj: any): boolean =>
    (obj !== null && typeof(obj) === 'object' && Object.prototype.toString.call(obj) === '[object Object]')

export const deepValue = (obj: {}, path?: string): any => {
    if (!path) {
        return obj
    }
    const paths = path.split('.')
    let current = obj, i, n

    for (i = 0, n = paths.length; i < n; ++i) {
        if (current[paths[i]] === undefined) {
            return undefined
        } else {
            current = current[paths[i]]
        }
    }
    return current
}

export const merge = (a: any = {}, b: any): any => {
    for (const k of Object.keys(b)) {
        const ak = a[k],
              bk = b[k]
        if (Array.isArray(ak)) {
            ak.push(...bk)
        }
        else if (isObject(ak)) {
            merge(ak, bk)
        }
        else {
            a[k] = bk
        }
    }
    return a
}

export const ensure = <T>(map: WeakMap<{}, T> | Map<{}, T>,
                          obj: any,
                          defaultValue: any): T => {
    let lookup: any = map.get(obj)
    if (!lookup) {
        map.set(obj, lookup = defaultValue)
    }
    else if (Array.isArray(lookup) && Array.isArray(defaultValue)) {
        lookup.push(...defaultValue)
    }
    else if (isObject(lookup)) {
        merge(lookup, defaultValue)
    }
    return lookup
}

export const propertyCallbacks = new WeakMap<object, TypedMap<Array<PropertyCallback>>>()

export const addPropertyListener = (obj: object, property: string, callback: PropertyCallback) => {
    let val = obj[property]
    const observed = propertyCallbacks.has(obj) && propertyCallbacks.get(obj)[property]
    ensure(propertyCallbacks, obj, {[property]: [callback]})
    if (!observed) {
        Object.defineProperty(obj, property, {
            get: () => val,
            set: (newVal) => {
                val = newVal
                for (const c of propertyCallbacks.get(obj)[property]) {
                    c(property)
                }
                return val
            }
        })
    }
}

export const createObjectPropertyListener = (obj: object, pathStr: string, callback: Callback) => {
    const path = pathStr.split('.'),
          property = path.pop(),
          root = deepValue(obj, path.join('.')),
          handler = () => {
              for (const cb of pathCallbacks.get(obj)[pathStr]) {
                  cb()
              }
          }
    ensure(pathCallbacks, obj, {[pathStr]: [callback]})
    addPropertyListener(root, property, handler)
}
