import {Template} from '../decorators/template'
import {ArrayWidget} from '../decorators/construct'
import './string-bindings.pcss'
import './custom-component'

export class Node implements ArrayWidget {

    children: Node[] = []
    text: string

    constructor(text: string, children: Node[]) {
        this.children = children
        this.text = text
    }

    @Template()
    markupAll() {
        return `
        <li>
            <span>{{text}}</span>
            <ul {{children}}/>
        </li>`
    }
}
