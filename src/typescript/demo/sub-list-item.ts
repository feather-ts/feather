import {ArrayWidget} from '../decorators/construct'
import {Template} from '../decorators/template'
import './icon'

export class SubListItem implements ArrayWidget {

    text: string
    icon: string

    constructor(text: string, icon: string) {
        this.text = text
        this.icon = icon
    }

    @Template()
    markup() {
        return `
        <li>
            <span class="{{icon}}">
                {{text}}<Icon icon={{icon}}/>
            </span>
        </li>`
    }
}
