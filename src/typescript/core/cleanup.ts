import {ensure} from '../utils/objects'
import {allChildNodes} from '../utils/dom'

const cleanUpQueue = new WeakMap<Node, Function[]>()

export const registerCleanUp = (node: Node, task: Function) => ensure(cleanUpQueue, node, [task])

export const cleanUp = (node: Node) => setTimeout(() =>
    allChildNodes(node).forEach(node => {
        if (cleanUpQueue.has(node)) {
            cleanUpQueue.get(node).forEach(task => task())
            cleanUpQueue.delete(node)
        }
}), 80)
