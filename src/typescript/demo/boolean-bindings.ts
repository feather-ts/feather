import {Template} from '../decorators/template'
import {Construct, Widget} from '../decorators/construct'
import {render} from '../core/bind'
import {On} from '../decorators/event'
import './boolean-bindings.pcss'

@Construct({selector: 'boolean-bindings'})
export class BooleanBindings implements Widget {

    bool = true

    init = (el: Element) => render(this, el)

    @On({event: 'click', selector: 'input'})
    onNewValueClick() {
       this.bool = !this.bool
    }

    @Template()
    markupAll() {
       return `
        <h2 class="subtitle">Boolean bindings</h2>
        <div class="columns bd-content" id="string-bindings-text-nodes">
            <div class="column clickable">
                <p class="error {{bool}}" data-test={{bool}} {{bool}}>
                    Birds of a {{bool}} flock together
                </p>
            </div>
            <div class="column">
                <p class="error {{bool:yesno}}" data-test="{{bool:yesno}}" {{bool}}>
                    Birds of a {{bool:yesno}} together
                </p>
            </div>
            <div class="column">
                <p class="error {{bool:yesno:globalUpperCase}}" data-test="{{bool:yesno:globalUpperCase}}" {{bool}}>
                    Birds of a {{bool:yesno:globalUpperCase}} together
                </p>
            </div>
           <div class="column">
                <p class="error no-validation">
                    <input type="checkbox" class="checkbox" checked={{bool}}/>
                </p>
            </div>
        </div>
        `
    }

    yesno = (bool: boolean) => bool ? 'yes' : 'no'
}
