import {CURLIES, getTemplate, ParsedTemplate, parsedTemplates, parseHooks, SINGLE_CURLIES, TemplateTokenInfo, TemplateTokenType} from '../decorators/template'
import {compose, isDef, isUndef, throttle} from '../utils/functions'
import {createObjectPropertyListener, deepValue, ensure} from '../utils/objects'
import {isFunction} from '../utils/functions'
import {AnyWidget, ArrayWidget, ConstructRegistry, runConstructorQueue, Widget} from '../decorators/construct'
import {TransformerRegistry} from '../decorators/transformer'
import {ArrayListener, domArrayListener, observeArray} from '../utils/arrays'
import {createComputedListener} from '../decorators/computed'
import {cleanUp} from './cleanup'
import {allChildNodes} from '../utils/dom'
import {injectTemplateNodes} from '../decorators/template-node'
import {camelCaseFromHyphens} from '../utils/strings'

type TransformMap = {[k: string]: (val: any) => any}

const subWidgets = new WeakMap<AnyWidget, any[]>()

/*
 * This will fail for nested arrays when filtered elements are taken out of DOM,
 * however keeping track of the widget tree will make the framework way too complex.
 * For most use cases this will suffice and usually UI triggers changes from and to
 * visible elements. Dispatch code in connectTemplate method.
 */
const UPDATE_KEY = '__update__'

const Update = () => new CustomEvent(UPDATE_KEY, {bubbles: true, cancelable:false})

interface UpdateInfo {
    valueMap: any[]
    change: boolean
}

const updateDomValue = (template: ParsedTemplate, info: TemplateTokenInfo, value: any, oldValue: any) => {
    const node = template.nodes[info.position]
    if (info.type === TemplateTokenType.TEXT) {
        node.textContent = isDef(value) ? value : ''
    }
    else if (info.type === TemplateTokenType.CLASS) {
        isDef(oldValue) && node.classList.remove(oldValue) ||
        isDef(value) && node.classList.add(value)
    }
    else if (info.type === TemplateTokenType.ATTRIBUTE || info.type === TemplateTokenType.PROPERTY) {
        const attributeName = info.attribute || info.property()
        if (/checked|value/i.test(attributeName)) {
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
    for (let i = 0, n = template.infos.length; i < n; i++) {
        const info = template.infos[i]
        if (info.type === TemplateTokenType.TAG) {
            continue
        }
        const oldValue = oldValueMap[i],
              value    = valueMap[i]
        if (info.type === TemplateTokenType.PROPERTY && (Array.isArray(value) || value instanceof FilteredArray)) { // ignore arrays
            continue
        }
        if (oldValue !== value) {
            domChanged = true
            oldValueMap[i] = updateDomValue(template, info, value, oldValue)
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
    Array.from(node.attributes).forEach(attribute => {
        let match = attribute.value.match(CURLIES)
        const subProp = camelCaseFromHyphens(attribute.name)
        if (match) {
            const value = deepValue(widget, subProp)
            if (isFunction(value)) {
                subWidget[subProp] = value.bind(widget)
            } else {
                const prop = match[1]
                if (~prop.indexOf(':')) {
                    throw Error(`Cannot use transformer for ${prop}`)
                }
                const updateVal = () => {
                    subWidget[subProp] = deepValue(widget, prop)
                    return updateVal
                }
                createObjectPropertyListener(widget, prop, updateVal())
            }
            node.removeAttribute(attribute.name)
        } else if (match = attribute.value.match(SINGLE_CURLIES)) {
            subWidget[subProp] = new Function(`return ${match[1]}`)()
            node.removeAttribute(attribute.name)
        } else {
            subWidget[subProp] = attribute.value
        }
    })
    runConstructorQueue(subWidget, node)
}

class FilteredArray {} // flag class for update check

const getCurrentValueMap = (widget: AnyWidget, template: ParsedTemplate, transformMap: TransformMap) => {
    const map = []
    for (let i = 0, n = template.infos.length; i < n; i++) {
        const info = template.infos[i],
              path = info.path(),
              tempValue = [deepValue(widget, path)],
              transformer: Function = transformMap[info.curly()]
        if (Array.isArray(tempValue[0]) && isFunction(transformer(tempValue[0]))) {
            map[i] = new FilteredArray()
        } else {
            map[i] = tempValue
                .map(v => isFunction(v) ? v() : v)
                .map(v => transformer ? transformer(v) : v)[0]
        }
    }
    return map
}

const bindArray = (array: ArrayWidget[], widget: AnyWidget, info: TemplateTokenInfo,
                   template: ParsedTemplate, changeHappened: Function) => {
    const method = info.arrayTransformer(),
          transformer = (widget[method] || TransformerRegistry[method]).bind(widget)
    const listener = domArrayListener(
        array,
        template.nodes[info.position],
        transformer(),
        changeHappened,
        (item, templateName) => {
            const template = getTemplate(item, templateName),
                  node     = template.nodes[1]
            runConstructorQueue(item, node)
            connectTemplate(item, node, template, template.nodes[info.position])
            return node
        }
    )
    observeArray(array, listener)
    return listener
}

const getTransformMap = (widget: AnyWidget, template: ParsedTemplate): TransformMap => {
    return template.infos.reduce((p, c) => {
        if (c.transformers()) {
            p[c.curly()] = transformFactory(widget, c.transformers())
        }
        return p
    }, {})
}

const tagCmp = (a, b) =>
    (a.type === TemplateTokenType.TAG ? 1 : -1) - (b.type === TemplateTokenType.TAG ? 1 : -1)

const bindTemplateInfos = (template: ParsedTemplate, widget: AnyWidget, updateTemplate: Function,
                           arrayListeners: ArrayListener<ArrayWidget>[]) => {
    const bound = []
    const infos = template.infos.sort(tagCmp)
    for (const info of infos) {
        const path = info.path()
        const value = deepValue(widget, info.path())
        if (info.type === TemplateTokenType.TAG) {
            bindWidget(widget, info, template.nodes[info.position])
        }
        else if (info.type === TemplateTokenType.PROPERTY) {
            if (Array.isArray(value)) {
                arrayListeners.push(
                    bindArray(value, widget, info, template, () => updateTemplate(false))
                )
            }
        }
        else if (isFunction(value)) {
            createComputedListener(widget, info, updateTemplate)
        }
        else if (!bound.includes(path) && !Array.isArray(value)) {
            bound.push(path)
            createObjectPropertyListener(widget, path, () => updateTemplate())
        }
    }
}

export const connectTemplate = (widget: AnyWidget, el: Element, template: ParsedTemplate, parentNode: Element) => {
    const transformMap = getTransformMap(widget, template),
        arrayListeners: ArrayListener<ArrayWidget>[] = []
    let res = updateDom(widget, template, transformMap, [])
    const updateTemplate = (array = true) => {
        res = updateDom(widget, template, transformMap, res.valueMap)
        if (res.change) {
            parentNode.dispatchEvent(Update()) // let's inform parent widgets
        }
        if (array) {
            arrayListeners.forEach(l => l.splice(0, 0, [], []))
        }
    }
    el.addEventListener(UPDATE_KEY, () => throttle(updateTemplate, 80))
    bindTemplateInfos(template, widget, updateTemplate, arrayListeners)
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
    allChildNodes(el)
        .filter(del => del !== el)
        .forEach(cleanUp)
    el.innerHTML = ''
    const template = getTemplate(widget, name)
    connectTemplate(widget, el, template, el.parentNode as any)
    el.appendChild(template.doc)
}

export const findWidgets = <T>(widget: Widget, type: { new (...args: any[]): T }): T[] =>
    subWidgets.get(widget).filter(t => Object.getPrototypeOf(t) === type.prototype)

export const findWidget = <T>(widget: Widget, type: { new (...args: any[]): T }): T =>
    findWidgets(widget, type)[0]
