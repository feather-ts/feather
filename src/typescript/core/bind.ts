import {CURLIES, getTemplate, ParsedTemplate, SINGLE_CURLIES, TemplateTokenInfo, TemplateTokenType} from '../decorators/template'
import {compose, isDef, isFunction, isUndef} from '../utils/functions'
import {addPropertyListener, createObjectPropertyListener, deepValue, ensure} from '../utils/objects'
import {addToConstructorQueue, AnyWidget, ArrayWidget, ConstructRegistry, EnhancedConstructor, runConstructorQueue, Widget} from '../decorators/construct'
import {TransformerRegistry} from '../decorators/transformer'
import {domArrayListener, observeArray} from '../utils/arrays'
import {createComputedListener} from '../decorators/computed'
import {cleanUp} from './cleanup'
import {allChildNodes} from '../utils/dom'
import {injectTemplateNodes} from '../decorators/template-node'
import {camelCaseFromHyphens} from '../utils/strings'

type TransformMap = { [k: string]: (val: any) => any }

const subWidgets = new WeakMap<AnyWidget, any[]>()

/*
 * This will fail for nested arrays when filtered elements are taken out of DOM,
 * however keeping track of the widget tree will make the framework way too complex.
 * For most use cases this will suffice and usually UI triggers changes from and to
 * visible elements. Dispatch code in connectTemplate method.
 */
const UPDATE_KEY = '__update__'

const Update = () => new CustomEvent(UPDATE_KEY, {bubbles: true, cancelable: false, scoped: false})

interface UpdateInfo {
    valueMap: any[]
    change: boolean
}

const updateDomValue = (node: Element, info: TemplateTokenInfo, value: any, oldValue: any) => {
    if (info.type === TemplateTokenType.TEXT) {
        node.textContent = isDef(value) ? value : ''
    }
    else if (info.type === TemplateTokenType.CLASS) {
        !!oldValue && node.classList.remove(`${oldValue}`.replace(/\s+/g, '-'))
        !!value && node.classList.add(`${value}`.replace(/\s+/g, '-'))
    }
    else if (info.type === TemplateTokenType.ATTRIBUTE || info.type === TemplateTokenType.PROPERTY) {
        const attributeName = info.attribute || info.path()
        if (/checked|value|selectedIndex/i.test(attributeName)) {
            node[attributeName] = value
        }
        else if (isUndef(value) || value === false) {
            node.removeAttribute(attributeName)
        }
        else {
            const attrValue = value === true ? '' : value
            node.setAttribute(attributeName, attrValue)
        }
    }
    return value
}

const updateDom = (widget: AnyWidget, template: ParsedTemplate, transformMap: TransformMap, oldValueMap: any[]): UpdateInfo => {
    let domChanged = false
    const valueMap = getCurrentValueMap(widget, template, transformMap)
    for (let info, i = 0, n = template.infos.length; i < n; i++) {
        info = template.infos[i]
        if (info.type === TemplateTokenType.TAG) {
            continue
        }
        const value = valueMap[i]
        if (value === ARRAY_TAG) { // ignore array bindings
            continue
        }
        if (value === FILTERED_ARRAY_TAG) { // filter other arrays
            widget[info.path()].splice(0, 0)
            continue
        }
        const oldValue = oldValueMap[i]
        if (oldValue !== value) {
            domChanged = true
            oldValueMap[i] = updateDomValue(template.nodes[info.position], info, value, oldValue)
        }
    }
    return {
        change: domChanged,
        valueMap: oldValueMap
    }
}

const bindWidget = (widget: AnyWidget, rootInfo: TemplateTokenInfo, node: Element) => {
    const subWidget = new (Function.prototype.bind.apply(ConstructRegistry[rootInfo.selector]))
    ensure(subWidgets, widget, [subWidget])
    const attributes = Array.prototype.slice.call(node.attributes)
    for (let attribute: Attr, i = 0, n = attributes.length; i < n; i++) {
        attribute = attributes[i]
        let match = attribute.value.match(CURLIES)
        const subProp = camelCaseFromHyphens(attribute.name)
        if (match) {
            const prop = match[1]
            const value = deepValue(widget, prop)
            if (isFunction(value)) {
                subWidget[subProp] = value.bind(widget)
            } else {
                if (~prop.indexOf(':')) {
                    throw Error(`Cannot use transformer for ${prop}`)
                }
                const updateVal = () => {
                    subWidget[subProp] = deepValue(widget, prop)
                    return updateVal
                }
                addPropertyListener(widget, prop, updateVal())
            }
            node.removeAttribute(attribute.name)
        } else if (match = attribute.value.match(SINGLE_CURLIES)) {
            subWidget[subProp] = new Function(`return ${match[1]}`)()
            node.removeAttribute(attribute.name)
        } else {
            subWidget[subProp] = attribute.value
        }
    }
    runConstructorQueue(subWidget, node)
}

const ARRAY_TAG = Symbol('array_tag')
const FILTERED_ARRAY_TAG = Symbol('filtered_array_tag')

const getInfoValue = (widget: AnyWidget, info: TemplateTokenInfo, transformMap: TransformMap) => {
    const path                  = info.path(),
          transformer: Function = transformMap[info.curly()]
    let v = deepValue(widget, path)
    if (info.type === TemplateTokenType.PROPERTY && Array.isArray(v)) {
        return isFunction(transformer(v)) ? FILTERED_ARRAY_TAG : ARRAY_TAG
    } else {
        v = isFunction(v) ? v.call(widget) : v
        v = transformer ? transformer(v) : v
        return v
    }
}

const getCurrentValueMap = (widget: AnyWidget, template: ParsedTemplate, transformMap: TransformMap) => {
    const map = []
    for (let i = 0, n = template.infos.length; i < n; i++) {
        map[i] = getInfoValue(widget, template.infos[i], transformMap)
    }
    return map
}

const bindArray = (array: ArrayWidget[], parentNode: Element, widget: AnyWidget, info: TemplateTokenInfo,
                   templateName: Function, update: Function) => {
    const transformer = info.arrayTransformer() ? transformFactory(widget, info.transformers())() : undefined
    const listener = domArrayListener(
        array,
        parentNode,
        update,
        (item) => {
            const template = getTemplate(item, templateName()),
                  node     = template.nodes[1]
            runConstructorQueue(item, node)
            connectTemplate(item, node, template, parentNode)
            return node
        },
        transformer
    )
    observeArray(array, listener)
    return listener
}

const getTransformMap = (widget: AnyWidget, template: ParsedTemplate): TransformMap => {
    const map = {}
    for (let info: TemplateTokenInfo, i = 0, n = template.infos.length; i < n; i++) {
        info = template.infos[i]
        const transformers = info.transformers()
        if (transformers) {
            map[info.curly()] = transformFactory(widget, transformers)
        }
    }
    return map
}

const findTemplateInfoInNode = (template: ParsedTemplate, position: number) =>
    template.infos.find(i => i.position === position && i.attribute === 'template')

const findPropertyInfoInNode = (template: ParsedTemplate, position: number) =>
    template.infos.find(i => i.position === position && i.type === TemplateTokenType.PROPERTY)

const addTemplateAttributeHook = (widget: AnyWidget, node: Element, info: TemplateTokenInfo, transformMap: TransformMap) => {
    const value = getInfoValue(widget, info, transformMap)
    if (isDef(value)) {
        const updateTemplateNode = () => {
            const value = getInfoValue(widget, info, transformMap)
            render(widget, node, value)
            return updateTemplateNode
        }
        addPropertyListener(widget, info.path(), updateTemplateNode())
    } else {
        render(widget, node, info.curly())
    }
    node.removeAttribute('template')
}

const bindTemplateInfos = (template: ParsedTemplate, widget: AnyWidget, updateTemplate: Function,
                           transformMap: TransformMap) => {
    const bound = []
    const infos = template.infos
    for (let info: TemplateTokenInfo, i = 0, n = infos.length; i < n; i++) {
        info = infos[i]
        const path = info.path()
        const value = deepValue(widget, info.path())
        const node = template.nodes[info.position]
        if (info.type === TemplateTokenType.TAG) {
            bindWidget(widget, info, node)
        }
        else if (info.type === TemplateTokenType.PROPERTY) {
            if (Array.isArray(value)) {
                // check for dynamic template attribute
                const templateInfo = findTemplateInfoInNode(template, info.position)
                const attributeValue = node.getAttribute('template') || undefined
                let templateName
                if (isDef(templateInfo) && CURLIES.test(attributeValue)) {
                    templateName = () => getInfoValue(widget, templateInfo, transformMap)
                    addPropertyListener(widget, templateInfo.path(), () => {
                        value.splice(0, value.length, ...value)
                    })
                } else {
                    templateName = () => attributeValue
                }
                bindArray(value, node, widget, info, templateName, updateTemplate)
                node.removeAttribute('template')
            }
        }
        else if (isFunction(value)) {
            createComputedListener(widget, info, updateTemplate)
        }
        else if (info.type === TemplateTokenType.TEMPLATE) {
            const propInfo = findPropertyInfoInNode(template, info.position)
            if (isUndef(propInfo) || !Array.isArray(deepValue(widget, propInfo.path()))) {
                addTemplateAttributeHook(widget, node, info, transformMap)
            }
        }
        else if (!bound.includes(path) && !Array.isArray(value)) {
            bound.push(path)
            createObjectPropertyListener(widget, path, () => updateTemplate())
        }
    }
}

export const connectTemplate = (widget: AnyWidget, el: Element, template: ParsedTemplate, parentNode = el.parentNode) => {
    const transformMap = getTransformMap(widget, template)

    let res = updateDom(widget, template, transformMap, [])
    const updateTemplate = () => {
        if (!mutedWidget.has(widget)) {
            res = updateDom(widget, template, transformMap, res.valueMap)
            if (res.change) {
                parentNode.dispatchEvent(Update()) // let's inform parent widgets
            }
        }
    }
    el.addEventListener(UPDATE_KEY, updateTemplate, {passive: true, capture: false})
    bindTemplateInfos(template, widget, updateTemplate, transformMap)
    injectTemplateNodes(widget, template.nodes)
}

const transformFactory = (widget: AnyWidget, transformers: string[]) =>
    compose(transformers.map(m => {
        const transformer = (widget[m] || TransformerRegistry[m])
        if (isUndef(transformer)) {
            throw Error(`No transformer found for ${m}. Implement function on ${widget.constructor.name} or annotate a method with @Transformer()`)
        }
        return transformer.bind(widget)
    }))

export const render = (widget: any, el: Element, name?: string) => {
    const children = allChildNodes(el)
    for (let node: Node, i = 1, n = children.length; i < n; i++) { // first element is 'el' itself
        node = children[i]
        cleanUp(node)
        el.removeChild(node)
    }
    const template = getTemplate(widget, name)
    connectTemplate(widget, el, template)
    el.appendChild(template.doc)
}

export const findWidgets = <T>(widget: Widget, type: { new(...args: any[]): T }): T[] =>
    subWidgets.get(widget).filter(t => Object.getPrototypeOf(t) === type.prototype)

export const findWidget = <T>(widget: Widget, type: { new(...args: any[]): T }): T =>
    findWidgets(widget, type)[0]

const mutedWidget = new WeakMap<AnyWidget, boolean>()

export const Batch = () => (proto: AnyWidget, method: string) => {
    addToConstructorQueue(proto.constructor as EnhancedConstructor, (widget: AnyWidget, el: Element) => {
        const old = widget[method]
        Object.defineProperty(widget, method, {
            value: function () {
                mutedWidget.set(widget, true)
                old.apply(widget, arguments)
                mutedWidget.delete(widget)
                el.dispatchEvent(Update())
            }
        })
    })
}
