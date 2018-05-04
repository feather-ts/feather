import {Template} from '../decorators/template'
import {Construct, Widget} from '../decorators/construct'
import {render} from '../core/bind'
import {ElementQuery} from '../decorators/element-query'

@Construct({selector: 'element-responsive'})
export class ElementResponsive implements Widget {

    string = ''

    init = (el: Element) => render(this, el)

    @ElementQuery((el: Element) => el.clientWidth < 300)
    small(ev, el: Element) {
        this.string = 'small'
    }

    @ElementQuery((el: Element) => el.clientWidth >= 300)
    big(ev, el: Element) {
        this.string = 'big'
    }

    @Template()
    markup1() {
        return `
        <h2 class="subtitle">Element responsive component</h2>
        <div>{{string}}</div>
        `
    }
}
