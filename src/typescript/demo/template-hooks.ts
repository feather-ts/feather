import {Template} from '../decorators/template'
import {Construct, Widget} from '../decorators/construct'
import {render} from '../core/bind'
import {On} from '../decorators/event'

@Construct({selector: 'template-hooks', singleton: true})
export class TemplateHooks implements Widget {

    text = 'Andromeda'
    view = 'partial-a'

    init = (el: Element) => render(this, el)

    @On({})
    click() {
        this.view = this.view === 'partial-a' ? 'partial-b' : 'partial-a'
    }

    @Template()
    markupAll() {
        return `
        <h2 class="subtitle">Template gooks</h2>
        <div template="partial-a"></div>
        <div template={{view}}></div>
        `
    }

    @Template('partial-a')
    partialA() {
        return '<div>Andromeda</div>'
    }

    @Template('partial-b')
    partialB() {
        return '<div>Black Eye Galaxy</div>'
    }
}
