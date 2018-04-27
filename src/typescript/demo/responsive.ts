import {MediaQuery} from '../decorators/media-query'
import {Template} from '../decorators/template'
import {Construct, Widget} from '../decorators/construct'
import {render} from '../core/bind'

@Construct({selector: 'responsive'})
export class Responsive implements Widget {

    init = (el: Element) => 0

    @MediaQuery('all and (max-width: 768px)')
    mobile(el: Element) {
        render(this, el, 'mobile')
    }

    @MediaQuery('all and (min-width: 768px)')
    desktop(el: Element) {
        render(this, el, 'desktop')
    }

    @Template('desktop')
    markup1() {
        return `
        <h2 class="subtitle">Responsive component</h2>
        <div>Desktop</div>
        `
    }

    @Template('mobile')
    markup2() {
        return `
        <h2 class="subtitle">Responsive component</h2>
        <div>Mobile</div>
        `
    }
}
