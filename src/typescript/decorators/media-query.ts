import {addToConstructorQueue, AnyWidget, EnhancedConstructor} from './construct'
import {registerCleanUp} from '../core/cleanup'

export const MediaQuery = (query: string) => (proto: AnyWidget, method: string) => {
    const mediaQueryHandler = (widget: AnyWidget, node: Node) => (mq: MediaQueryList) => {
        if (mq.matches) {
            widget[method].call(widget, node)
        }
    }
    addToConstructorQueue(proto.constructor as EnhancedConstructor, (widget: AnyWidget, node: Node) => {
        const mediaQueryList = window.matchMedia(query)
        const handler = mediaQueryHandler(widget, node)
        mediaQueryList.addListener(handler)
        registerCleanUp(node, () => mediaQueryList.removeListener(handler))
        handler(mediaQueryList)
    })
}
