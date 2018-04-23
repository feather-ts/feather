import {Template} from '../decorators/template'
import {Construct, Widget} from '../decorators/construct'
import {render} from '../core/bind'
import {On} from '../decorators/event'

@Construct({selector: 'custom-component'})
export class ComponentComponent implements Widget {

    fromParent: string
    rawJavaScript: number
    func: Function

    init = (el: Element) => render(this, el)

    @On({selector: 'button'})
    click() {
        this.func('Earth')
    }

    @Template()
    markupAll() {
       return `
        <h3 class="subtitle {{fromParent}}">Passed on: {{fromParent}} and raw javascript: {{rawJavaScript}}</h3>
        <div><button>Change text</button></div>
        `
    }
}
