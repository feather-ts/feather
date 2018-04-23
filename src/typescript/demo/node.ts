import {Template} from '../decorators/template'
import {ArrayWidget, Construct, Widget} from '../decorators/construct'
import {render} from '../core/bind'
import './string-bindings.pcss'
import './custom-component'
import {On} from '../decorators/event'

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
