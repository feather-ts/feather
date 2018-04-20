import {ArrayWidget} from '../decorators/construct'
import {cleanUp, registerCleanUp} from '../core/cleanup'

type   MethodKey = 'sort' | 'splice'
const  observers = new WeakMap<any[], ArrayListener<any>[]>()

export interface ArrayListener<T> {
    sort(indices: number[])
    splice(start: number, deleteCount: number, addedItems: T[], deletedItems: T[])
}

export function removeFromArray(arr: any[], elements: any[]) {
    if (!arr || arr.length === 0) {
        return
    }
    let deleteCount = 0,
        total = elements.length
    for (let i = arr.length; i--;) {
        if (~elements.indexOf(arr[i])) {
            deleteCount++ // optimize removal of consecutive elements
        }
        else if (deleteCount) {
            arr.splice(i + 1, deleteCount)
            if ((total -= deleteCount) === 0) { // if we removed all already, break early
                deleteCount = 0
                break
            }
            deleteCount = 0
        }
    }
    if (deleteCount) {
        arr.splice(0, deleteCount)
    }
    return arr
}

const notify = (arr, method: MethodKey, args: any[]) => {
    const listeners = observers.get(arr)
    for (const listener of listeners) {
        listener[method].apply(arr, args)
    }
}

function duckPunchSplice<T>(arr: any) {
    const old = arr.splice
    // add docs that removing and re-adding elements to the same array kills event listeners
    arr.splice = function (index, deleteCount) {
        const addedItems = [].slice.call(arguments, 2),
              deletedItems = old.apply(arr, arguments)
        notify(arr, 'splice', [index, deleteCount, addedItems, deletedItems])
        return deletedItems
    }
}

function duckPunchSort<T>(arr: any) {
    const old = arr.sort
    arr.sort = (cmp) => {
        // sort is a special case, we need to inform listeners how sorting has changed the array
        const indices = range(0, arr.length - 1),
              args = cmp ? [
                  arr.map ((e, i) => i)
                     .sort((a, b) => cmp(arr[a], arr[b]))
                     .map (e => indices[e])
              ] : indices,
              res = old.call(arr, cmp)
        notify(arr, 'sort', args)
        return res
    }
}

export const range = (start: number, end: number): number[] => {
    const len = end - start + 1,
          arr = new Array<number>(len)
    for (let i = 0, l = arr.length; i < l; i++) {
        arr[i] =  i + start
    }
    return arr
}

// essentially we can reduce array modifying functions to two implementations: sort and splice
export const observeArray = <T>(arr: T[], listener: ArrayListener<T>) => {
    // replace this in the future with es6 proxies
    const listeners = observers.get(arr)
    if (!listeners) {
        observers.set(arr, [listener])
        arr.pop = function(): T {
            return arr.splice(arr.length - 1, 1)[0]
        }
        arr.push = function(...items: T[]): number {
            arr.splice(arr.length, 0, ...items)
            return arr.length
        }
        arr.fill = function(): T[] {
            throw Error('observed arrays cannot be filled. items must be unique, use Array.splice instead!')
        }
        arr.reverse = function() {
            const ref = arr.slice()
            arr.sort((a, b) => ref.indexOf(b) - ref.indexOf(a))
            return arr
        }
        arr.shift = function(): T {
            return arr.splice(0, 1)[0]
        }
        arr.unshift = function(...items: T[]): number {
            arr.splice(0, 0, ...items)
            return arr.length
        }
        duckPunchSplice(arr)
        duckPunchSort(arr)
    }
    else {
        listeners.push(listener)
    }
}

export function domArrayListener(arr: ArrayWidget[],
                                 el: Element,
                                 filter: Function,
                                 changeHappened: Function,
                                 onItemAdded: Function): ArrayListener<ArrayWidget> {
    const firstChild = el.firstElementChild // usually null, lists that share a parent with other nodes are prepended.
    let nodeVisible: boolean[] = []
    const elementMap = new WeakMap<ArrayWidget, Element>()
    const templateName = el.getAttribute('template') || undefined // getAttribute returns null
    const listener: ArrayListener<ArrayWidget> = {
        sort(indices: any[]) {
            const copy: boolean[] = []
            for (let i = 0; i < indices.length; i++) {
                if (nodeVisible[indices[i]]) {
                    el.appendChild(elementMap.get(arr[i]))
                }
                copy[i] = nodeVisible[indices[i]]
            }
            nodeVisible = copy
            changeHappened()
        },
        splice(index: number, deleteCount: number, added: ArrayWidget[], deleted: ArrayWidget[] = []) {
            const patch = Array.from<boolean>(nodeVisible)

            nodeVisible.splice(index, deleteCount, ...added.map(() => false))

            if (deleteCount) {
                deleted.forEach(del => {
                    const node = elementMap.get(del)
                    if (node.parentElement === el) {
                        el.removeChild(node)
                    }
                    elementMap.delete(del)
                    cleanUp(node)
                })
            }
            if (added.length) {
                for (const item of added) {
                    if (!elementMap.has(item)) {
                        elementMap.set(item, onItemAdded(item, templateName))
                    }
                }
            }
            patch.splice(index, deleteCount, ...added.map(() => true))
            let change = false
            for (let i = 0, n = arr.length; i < n; i++) {
                patch[i] = filter(arr[i], i)
                if (patch[i] && !nodeVisible[i]) {
                    const nextVisible = nodeVisible.indexOf(true, i),
                          refNode     = ~nextVisible ? elementMap.get(arr[nextVisible]) : firstChild
                    el.insertBefore(elementMap.get(arr[i]), refNode)
                    change = true
                }
                else if (!patch[i] && nodeVisible[i]) {
                    el.removeChild(elementMap.get(arr[i]))
                    change = true
                }
            }
            if (deleteCount || added.length || change) {
                changeHappened()
            }
            nodeVisible = patch
        }
    }
    listener.splice(0, 0, arr, [])
    registerCleanUp(el, () => observers.delete(arr))
    return listener
}
