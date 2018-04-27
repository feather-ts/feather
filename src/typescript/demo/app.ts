import 'bulma/css/bulma.css'

import {Template} from '../decorators/template'
import {Construct, Widget} from '../decorators/construct'
import {render} from '../core/bind'
import {Transformer} from '../decorators/transformer'
import './app.pcss'
import './string-bindings'
import './boolean-bindings'
import './array-bindings'
import './component-tags'
import './template-hooks'
import './responsive'
import './events'

@Construct({selector: '.application'})
export class MyApp implements Widget {

    appVar = 'flock'

    init(el: Element) {
        render(this, el)
    }

    @Template()
    markup() {
        return `
        <string-bindings/>
        <boolean-bindings/>
        <array-bindings/>
        <component-tags/>
        <template-hooks/>
        <responsive/>
        <events/>
        `
    }

    @Transformer()
    globalUpperCase = (str: string) => str.toUpperCase()

    @Transformer()
    appendFlock = (str: string) => `${str} ${this.appVar}`

    @Transformer()
    globalClassSuffix = (str: string) => `${str}-${this.appVar}`
}
