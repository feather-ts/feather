const getType = {}.toString

export const compose = <U>(fns: Function[]): any => (res: any): U => {
    if (fns.length === 1) {
        return fns[0](res)
    }
    return fns.reduce((p, c) => c(p), res) as U
}

export const isFunction = (functionToCheck: any): boolean =>
    functionToCheck && getType.call(functionToCheck) === '[object Function]'

export const isDef = (x) => typeof x !== 'undefined'
export const isUndef = (x) => !isDef(x)
