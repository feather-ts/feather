import {ArrayWidget} from '../decorators/construct'
import {MyApp} from './app'
import {Inject} from '../decorators/inject'
import {SubListItem} from './sub-list-item'
import {On} from '../decorators/event'
import {Template} from '../decorators/template'
import './sub-list-item'
import './icon'

export class ListItem implements ArrayWidget {

    @Inject() myApp: MyApp

    text: string
    icon: string

    toggle: true
    subs = []

    constructor(text: string, icon: string) {
        this.text = text
        this.icon = icon
    }

    @On({event: 'click', selector: 'button'})
    delegatedClick(ev: MouseEvent) {
        this.subs.push(
            new SubListItem('Apricot', 'Orange'),
            new SubListItem('Pear', 'Green')
        )
    }

    @On({event: 'click', selector: 'input'})
    clickCheckbox(ev) {
        this.toggle = ev.target.checked
    }

    @Template()
    markup() {
        return `
        <li>
            <span class="{{icon}}">
                {{text}}<Icon icon={{icon}}/>
            </span>
            <input type="checkbox" checked="{{toggle}}"/>
            <ul {{subs:startsWithA}}/>
            <button>{{subs:size}}</button>
        </li>`
    }

    @Template('alternative')
    markup2() {
        return `<li>{{text}}</li>`
    }
}
