import {ensure, TypedMap} from '../utils/objects'
import {addToConstructorQueue, EnhancedConstructor, Widget} from './construct'
import {format} from '../utils/strings'
import {isDef, isFunction} from '../utils/functions'

export type Processor = (res: Response) => Promise<any>

const fetchErrors = new WeakMap<any, TypedMap<Function>>()

const defaultProcessor: Processor = (res: Response) => res.json()

export interface FetchConfig extends RequestInit {
    url: string
    processor?: Processor
}

const handleErrors = (response: Response) => {
    if (!response.ok) {
        console.error(response)
        throw new ResponseError(response.statusText, response)
    }
    return response
}

class ResponseError extends Error {

    response: Response

    constructor(message: string, response: Response) {
        super(message)
        this.response = response
    }
}

const execFetch = (url: string, conf: RequestInit, processor: Processor = defaultProcessor): Promise<Response> => {
    return fetch(url, conf)
        .then(handleErrors)
        .then(processor)
}

const Xhr = (fetchMethod: string) => (conf: FetchConfig) => (proto: any, method: string) => {
    addToConstructorQueue(proto.constructor as EnhancedConstructor, (widget: Widget) => {
        const oldMethod = proto[method]
        widget[method] = (body: object | string) => {
            const payload = [body]
                .filter(isDef)
                .map(body => typeof body === 'string' ? body : JSON.stringify(body))
            const finalConf: FetchConfig = Object
                .keys(conf)
                .reduce((p, c) =>
                    (p[c] = isFunction(p[c]) ? p[c].call(widget) : p[c]) && p,
                    {...conf,
                        url: format(conf.url, widget),
                        body: payload[0],
                        method: fetchMethod
                    })
            return execFetch(finalConf.url, finalConf, finalConf.processor)
                .then(res => {
                    oldMethod.apply(widget, [...payload, res])
                    return res
                }) // if await should not be used
                .catch((error: ResponseError) => {
                    const proto = Object.getPrototypeOf(widget)
                    if (fetchErrors.has(proto)) {
                        const errFunc = fetchErrors.get(proto)[status]
                        if (errFunc) {
                            errFunc.call(widget, error)
                        }
                    }
                })
        }
    })
}

export const Get = Xhr('GET')
export const Post = Xhr('POST')
export const Delete = Xhr('DELETE')
export const Put = Xhr('PUT')

const FetchError = (status: number) => (proto: any, method: string) => {
    ensure(fetchErrors, proto, {[`${status}`]: proto[method]})
}

