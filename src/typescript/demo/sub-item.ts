import {ArrayWidget} from '../decorators/construct'
import {Template} from '../decorators/template'

export class SubItem implements ArrayWidget {

    text: number

    constructor(text: number) {
        this.text = text
    }

    @Template()
    markup() {
        return `<span>{{text}}</span>`
    }
}
