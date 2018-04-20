import {TypedMap} from '../utils/objects'
import {addToConstructorQueue, EnhancedConstructor, Widget} from './construct'
import {namedRegexMatch} from '../utils/strings'
import {registerCleanUp} from '../core/cleanup'

export interface RouteHandler {
    route: string
    callback: Function
}

export const routeListeners: TypedMap<RouteHandler[]> = {}
const namedRx = /[:*]\w+/gi
const historyAPI = (window.history && window.history.pushState) && document.querySelector('[routing="hash"]') === null

const rules = [
    [/:\w+/gi, '([\\w\\d-]+)'],
    [/\*\w+/gi, '(.+)']
]

// supports :param and *param and optional parts ()
const namedMatch = (pattern: string, input: string): TypedMap<string> => {
    let names = pattern.match(namedRx)
    if (names && names.length) {
        names = names.map(str => str.substr(1))
        const repl = rules.reduce((p, c: any) => p.replace(c[0], c[1]), pattern),
              finalR = new RegExp('^' + repl + '$', 'gi')
        return namedRegexMatch(input, finalR, names)
    }
    else {
        if (new RegExp('^' + pattern + '$', 'gi').exec(input)) {
            return {}
        }
    }
}

const getCurrentRoute = () => {
    let path = location.pathname
    if (!historyAPI) {
        if (path !== '/') {
            location.replace('/#' + path)
        }
        else {
            path = !location.hash ? '/' : location.hash.replace(/^#/, '')
        }
    }
    return path
}

const notifyListeners = (route: string) => {
    Object.values(routeListeners).forEach((handlers: RouteHandler[]) =>
        handlers.forEach(rh => {
            const matchedParams = namedMatch(rh.route, route)
            if (matchedParams) {
                rh.callback(matchedParams)
            }
        })
    )
}

export const navigate = (path: string) => {
    if (historyAPI) {
        history.pushState(null, '', path)
        notifyListeners(getCurrentRoute())
    }
    else {
        location.hash = path
    }
}

export const runRoutes = () => {
    if (!window['blockRouting']) {
        notifyListeners(getCurrentRoute())
    }
    window.addEventListener(historyAPI ? 'popstate' : 'hashchange', () => notifyListeners(getCurrentRoute()), false)
}

export const Route = (route: string) => (proto: Widget, method: string) => {
    addToConstructorQueue(proto.constructor as EnhancedConstructor, (widget: Widget, node: Node) => {
        if (!routeListeners[route]) {
            routeListeners[route] = []
        }
        const handler: RouteHandler = {route, callback: widget[method].bind(widget)}
        routeListeners[route].push(handler)
        registerCleanUp(node, () => routeListeners[route].splice(routeListeners[route].indexOf(handler), 1))
    })
}

