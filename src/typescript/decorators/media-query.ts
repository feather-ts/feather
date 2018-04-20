import {addToConstructorQueue, AnyWidget, EnhancedConstructor} from './construct'
import {registerCleanUp} from '../core/cleanup'

export const MediaQuery = (query: string) => (proto: AnyWidget, method: string) => {
    addToConstructorQueue(proto.constructor as EnhancedConstructor, (widget: AnyWidget, node: Node) => {
        const handler = (mq: MediaQueryList) => {
            if (mq.matches) {
                proto[method].call(widget, node)
            }
            return handler
        }
        const mediaQueryList = window.matchMedia(query)
        mediaQueryList.addListener(handler(mediaQueryList))
        registerCleanUp(node, () => mediaQueryList.removeListener(handler))
    })
}

