export function allChildNodes(node: Node): Element[] {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_ALL, null, false),
          nodes = []
    let currentNode
    do {
        currentNode = walker.currentNode
        if (currentNode.nodeType !== Node.TEXT_NODE || currentNode.textContent.trim()) {
            nodes.push(currentNode)
        }
    } while (walker.nextNode())
    return nodes
}

export function allTextNodes(node: Node): Node[] {
    const a = [],
          walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false)
    let n
    while (n = walk.nextNode()) {
        a.push(n)
    }
    return a
}
