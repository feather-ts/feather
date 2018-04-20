const getType = {}.toString

export const compose = <U>(fns: Function[]): any => (res: any): U => {
    if (fns.length === 1) {
        return fns[0](res)
    }
    return fns.reduce((p, c) => c(p), res) as U
}

export const isFunction = (functionToCheck: any): boolean =>
    functionToCheck && getType.call(functionToCheck) === '[object Function]'

const lastCall = new WeakMap<Function, number>()
const throttles = new WeakMap<Function, number>()

export const throttle = (func: Function, time: number) => {
    const now = +new Date()
    const lastCallTime = (lastCall.get(func) || 0)
    if (now - time >= lastCallTime) {
        func()
        lastCall.set(func, now)
    } else {
        clearTimeout(throttles.get(func))
        throttles.set(func, setTimeout(() => {
            lastCall.set(func, now)
            func()
        }))
    }
}

export const isDef = (x) => typeof x !== 'undefined'
export const isUndef = (x) => !isDef(x)
