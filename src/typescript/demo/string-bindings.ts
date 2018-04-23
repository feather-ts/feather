import {Template} from '../decorators/template'
import {Construct, Widget} from '../decorators/construct'
import {render} from '../core/bind'
import {On, Scope} from '../decorators/event'
import './string-bindings.pcss'

@Construct({selector: 'string-bindings', singleton: true})
export class StringBindings implements Widget {

    text = 'feather'

    init = (el: Element) => render(this, el)

    @On({event: 'click', selector: '.click-new-value'})
    onNewValueClick() {
        this.text = 'farmer'
    }


    @On({event: 'keyup', selector: 'input', scope: Scope.Direct})
    onNewTextEntered(ev, el: HTMLInputElement) {
        this.text = el.value
    }

    @Template()
    markupAll() {
        return `
        <h2 class="subtitle">String bindings</h2>
        <div class="columns bd-content" id="string-bindings-text-nodes">
            <div class="column clickable click-new-value">
                <p class="error {{text}}" data-test={{text}} {{text}}>
                    Birds of a {{text}} flock together
                </p>
            </div>
            <div class="column">
                <p class="error {{text:localClassSuffix}}" data-test="{{text:localClassSuffix}}" {{text}}>
                    Birds of a {{text:localUpperCase:appendFlock}} together
                </p>
            </div>
            <div class="column">
                <p class="error {{text:globalClassSuffix}}" data-test="{{text:globalClassSuffix}}" {{text}}>
                    Birds of a {{text:globalUpperCase:appendFlock}} together
                </p>
            </div>
           <div class="column">
                <p class="error no-validation">
                    <input type="text" class="input" value={{text}}/>
                </p>
            </div>
        </div>
        `
    }

    localUpperCase = (str: string) => str.toUpperCase()
    localClassSuffix = (str: string) => `${str}-suffix`
}
