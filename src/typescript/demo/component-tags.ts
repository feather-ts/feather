import {Template} from '../decorators/template'
import {Construct, Widget} from '../decorators/construct'
import {render} from '../core/bind'
import './custom-component'

@Construct({selector: 'component-tags', singleton: true})
export class ComponentTags implements Widget {

    passOn = 'Pluto'

    init = (el: Element) => render(this, el)

    @Template()
    markupAll() {
       return `
        <h2 class="subtitle {{passOn}}">Component Tags</h2>
        <custom-component from-parent={{passOn}} raw-java-script={1+1} func={{passOnFunction}}/>
        `
    }

    passOnFunction(text: string) {
        this.passOn = text
    }
}
