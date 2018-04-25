import {ensure} from '../utils/objects'
import {allChildNodes} from '../utils/dom'

const cleanUpQueue = new WeakMap<Node, Function[]>()

export const registerCleanUp = (node: Node, task: Function) => ensure(cleanUpQueue, node, [task])

export const cleanUp = (node: Node) => setTimeout(() => {
    for (const n of allChildNodes(node)) {
        if (cleanUpQueue.has(n)) {
            for (const task of cleanUpQueue.get(n)) {
                task()
            }
            cleanUpQueue.delete(n)
        }
    }
}, 80)
