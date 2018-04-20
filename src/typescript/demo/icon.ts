import {Construct, Widget} from '../decorators/construct'
import {Template} from '../decorators/template'
import {render} from '../core/bind'

@Construct({selector: 'icon'})
export class Icon implements Widget {

    icon: string

    init(el: Element) {
        render(this, el)
    }

    @Template()
    markup() {
        return `<span class="{{icon}}">{{icon}}</span>`
    }
}
