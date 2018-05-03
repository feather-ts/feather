import {Template} from '../decorators/template'
import {Construct, Widget} from '../decorators/construct'
import {render} from '../core/bind'
import './node'
import './element-responsive'

@Construct({selector: 'events', singleton: true})
export class Events implements Widget {

    nodes: Node[] = []

    init = (el: Element) => render(this, el)

    @Template()
    markupAll() {
        return `
        <h2 class="subtitle">Events</h2>
        <div class="columns bd-content">
            <div class="column">
                <p class="error no-validation">
                    <element-responsive/>
                </p>
            </div>
            <div class="column">
                <p class="error no-validation">
                </p>
            </div>
            <div class="column">
                <p class="error no-validation">
                </p>
            </div>
            <div class="column">
                <p class="error no-validation">
                    <ul {{nodes}}></ul>
                </p>
            </div>
        </div>
        `
    }
}
