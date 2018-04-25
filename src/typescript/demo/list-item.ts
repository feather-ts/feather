import {ArrayWidget} from '../decorators/construct'
import {Template} from '../decorators/template'
import {SubItem} from './sub-item'
import {range} from '../utils/arrays'
import './sub-item'
import {On} from '../decorators/event'

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

export class ListItem implements ArrayWidget {

    text: string
    subItems: SubItem[] = range(1, rnd(1, 5)).map(i => new SubItem(i))

    constructor(text: string) {
        this.text = text
    }

    @On({})
    click() {
        this.text = this.text.replace(/\)\s./, ') M')
    }

    @Template()
    markup() {
        return `
        <li>
            <div>{{text}}</div>
        </li>`
    }

    @Template('uppercase')
    markup2() {
        return `
        <li>
            <div>{{text:globalUpperCase}}</div>
        </li>`
    }


    @Template('subitems')
    markup3() {
        return `
        <li>
            <div>{{text}}</div>
            <div class="sub-items {{subItems:size}}" {{subItems}}/>
        </li>`
    }

    @Template('lowercase')
    markup4() {
        return `
        <li>
            <div>{{text:lowercase}}</div>
        </li>`
    }

    lowercase = (str: string) => str.toLowerCase()
}
