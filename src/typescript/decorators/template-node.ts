import {AnyWidget, ArrayWidget} from './construct'
import {ensure} from '../utils/objects'
import {isDef} from '../utils/functions'

interface TemplateNodeBinding {
    selector: string,
    property: string
}

const TemplateNodes = new WeakMap<AnyWidget, TemplateNodeBinding[]>()

export const TemplateNode = (selector: string) => (proto: ArrayWidget, property: string) => {
    ensure(TemplateNodes, proto, [{selector, property}])
}

export const injectTemplateNodes = (widget: AnyWidget, nodes: Element[]) => {
    const proto = Object.getPrototypeOf(widget)
    const bindings = TemplateNodes.get(proto)
    if (isDef(bindings)) {
        bindings.forEach(b => {
            widget[b.property] = nodes.reduce((p, c) => p || c.querySelector(b.selector), null)
        })
    }
}
