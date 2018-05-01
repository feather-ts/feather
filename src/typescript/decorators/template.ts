import {allChildNodes, allTextNodes} from '../utils/dom'
import {AnyWidget, ConstructRegistry} from './construct'
import {ensure, TypedMap} from '../utils/objects'
import {isUndef} from '../utils/functions'

const DEFAULT_TEMPLATE_NAME = '__default__'

export const parsedTemplates = new WeakMap<any, TypedMap<ParsedTemplate>>()
export const SINGLE_CURLIES = /{(.*?)}/
export const CURLIES = /{{(.*?)}}/
const ALL_CURLIES = /{{(.+?)}}/g
export const selfClosingTags = /(<([^<>\s]+)(\s+[^<>\s'"=]+(=[\w\d]+|="[^"]*"|='[^']*'|={{?[^}]*?}?})?)*)\s*\/>/gmi
export const openTags = '$1></$2>'

export enum TemplateTokenType {
    CLASS,
    PROPERTY,
    ATTRIBUTE,
    TEMPLATE,
    TEXT,
    TAG
}

export class TemplateTokenInfo {
    private _curly: string
    private _path: string
    private _transformers: string[]
    selector: string
    attribute: string

    constructor(public position: number, public type: TemplateTokenType) {
    }

    setCurly(value: string) {
        this._curly = value
        const tokens = value.split(':')
        this._path = tokens.shift()
        this._transformers = tokens
    }

    curly(): string {
        return this._curly
    }

    path() {
        return this._path
    }

    transformers() {
        return this._transformers
    }

    arrayTransformer() {
        if (this._transformers.length > 1) {
            throw Error('Array filter transformer can have only one method')
        }
        return this.transformers()[0] || 'arrayidentity'
    }
}

export const breakApartTextNodes = (root: DocumentFragment) => {
    const textNodes = allTextNodes(root)
    for (let i = 0, n = textNodes.length; i < n; i++) {
        const node = textNodes[i]
        const split = node.textContent.split(/({{.*?}})/mg)
        if (split.length > 1) {
            const parent = node.parentNode,
                  frag   = document.createDocumentFragment()
            for (const text of split) {
                if (text !== '') {
                    frag.appendChild(document.createTextNode(text))
                }
            }
            parent.replaceChild(frag, node)
        }
    }
    return root
}

export const getFragment = (html: string) => {
    const templateTag = document.createElement('template') as HTMLTemplateElement
    templateTag.innerHTML = html
    return templateTag.content
}

export class ParsedTemplate {
    infos: TemplateTokenInfo[]
    doc: Node
    nodes: Element[]

    constructor(doc: Node, nodes: Element[], infos: TemplateTokenInfo[]) {
        this.doc = doc
        this.infos = infos
        this.nodes = nodes
    }

    clone(): ParsedTemplate {
        const doc = this.doc.cloneNode(true)
        return new ParsedTemplate(doc, allChildNodes(doc), this.infos)
    }
}

export const getTemplate = (widget: AnyWidget, name = DEFAULT_TEMPLATE_NAME): ParsedTemplate => {
    const proto = Object.getPrototypeOf(widget)
    const templates = parsedTemplates.get(proto)
    if (isUndef(templates) || isUndef(templates[name])) {
        throw Error(`No template found for name ${name} in ${widget.constructor.name}`)
    }
    return templates[name].clone()
}

export const parseTemplate = (templateStr: string): ParsedTemplate => {
    const source   = templateStr.replace(selfClosingTags, openTags),
          frag     = breakApartTextNodes(getFragment(source)),
          allNodes = allChildNodes(frag),
          hookMap  = {} // we need to remember case sensitive hooks, b/c attributes turn lowercase
    let m
    while (m = ALL_CURLIES.exec(templateStr)) {
        hookMap[m[1].toLowerCase()] = m[1]
    }
    return new ParsedTemplate(frag, allNodes, parseHooks(allNodes, hookMap))
}

export const parseHooks = (nodes: Element[], hookMap = {}): TemplateTokenInfo[] => {
    const hooks: TemplateTokenInfo[] = []
    const selectors = Object.keys(ConstructRegistry)
    let match
    for (let pos = 0, n = nodes.length; pos < n; pos++) {
        const node = nodes[pos]
        if (node.nodeType === Node.TEXT_NODE) {
            const text  = node.textContent,
                  match = CURLIES.exec(text)
            // <div id="2">some text {{myProperty}}</div>
            if (match !== null) {
                const token = new TemplateTokenInfo(pos, TemplateTokenType.TEXT)
                token.setCurly(match[1])
                hooks.push(token)
            }
        }
        else if (node.nodeType === Node.ELEMENT_NODE) {
            const matchingSelectors = selectors.filter(s => node.matches(s))
            const inSubWidget = matchingSelectors.length
            if (inSubWidget) {
                for (const selector of matchingSelectors) {
                    const token = new TemplateTokenInfo(pos, TemplateTokenType.TAG)
                    token.selector = selector
                    hooks.push(token)
                }
            }
            for (const attribute of Array.from(node.attributes)) {
                const attributeName = attribute.nodeName
                if (attributeName === 'class') {
                    // <div id="2" class="red {{myClass}} blue">
                    const classes = Array.from((node as HTMLElement).classList)
                    for (const cls of classes) {
                        if (match = cls.match(CURLIES)) {
                            (node as HTMLElement).classList.remove(match[0])
                            const token = new TemplateTokenInfo(pos, TemplateTokenType.CLASS)
                            token.setCurly(match[1])
                            hooks.push(token)
                        }
                    }
                }
                else if (match = attributeName.match(CURLIES)) {
                    // <div id="2" {{myProperty}}>
                    (node as HTMLElement).removeAttribute(match[0])
                    const token = new TemplateTokenInfo(pos, TemplateTokenType.PROPERTY)
                    token.setCurly(hookMap[match[1]])
                    hooks.push(token)
                }
                else if (!inSubWidget) {
                    if (attributeName === 'template') {
                        const token = new TemplateTokenInfo(pos, TemplateTokenType.TEMPLATE)
                        token.attribute = attributeName
                        if (match = attribute.value.match(CURLIES)) {
                            token.setCurly(match[1])
                        } else {
                            token.setCurly(attribute.value)
                        }
                        hooks.push(token)
                    }
                    else {
                        // <div id="2" myProperty="{{myProperty}}">
                        const value = attribute.value
                        if (match = value.match(CURLIES)) {
                            (node as HTMLElement).removeAttribute(attributeName)
                            const token = new TemplateTokenInfo(pos, TemplateTokenType.ATTRIBUTE)
                            token.setCurly(match[1])
                            token.attribute = attributeName
                            hooks.push(token)
                        }
                    }
                }
            }
        }
    }
    return hooks
}

export const Template = (name = DEFAULT_TEMPLATE_NAME) => (proto: AnyWidget, method: string) => {
    const templateStr = proto[method].call(proto)
    const template = parseTemplate(templateStr)
    ensure(parsedTemplates, proto, {[name]: template})
}
