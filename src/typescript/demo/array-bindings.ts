import {Template} from '../decorators/template'
import {Construct, Widget} from '../decorators/construct'
import {render} from '../core/bind'
import {ListItem} from './list-item'
import './array-bindings.pcss'
import {range} from '../utils/arrays'
import {On} from '../decorators/event'
import {Transformer} from '../decorators/transformer'

const planets = [
    'Mercury',
    'Venus',
    'Earth',
    'Mars',
    'Jupiter',
    'Saturn',
    'Uranus',
    'Neptune',
    'Pluto' // ye ye.
]

@Construct({selector: 'array-bindings', singleton: true})
export class ArrayBindings implements Widget {

    items: ListItem[] = range(0, 7)
        .map(i => new ListItem(`${String.fromCharCode(i + 65)}) ${planets[i]}`))

    dynamic = 'lowercase'

    init = (el: Element) => render(this, el)

    @On({event: 'click', selector: '#change-view'})
    onNewValueClick() {
        this.dynamic = this.dynamic === 'uppercase' ? 'lowercase' : 'uppercase'
        console.log(this.items.length)
    }

    @On({event: 'click', selector: '.add'})
    onAddPluto() {
        this.items.push(new ListItem(`J) Pluto`))
    }

    @On({event: 'click', selector: '.del'})
    onDelPlanet() {
        this.items.pop()
    }

    @Template()
    markupAll() {
        return `
        <h2 class="subtitle">Array bindings</h2>
        <div>
            <span class="{{items:toClass}}">Size {{items:size}}</span>,
            <span>starts with p|m {{items:pOrM}}</span>
        </div>
        <div class="columns bd-content" id="array-bindings">
            <div class="column">
                <ul {{items}}/>
            </div>
            <div class="column">
                <ul {{items:even}}/>
            </div>
            <div class="column">
                <ul {{items}} template="uppercase"/>
            </div>
            <div class="column">
                <ul {{items:even}} template="subitems"/>
            </div>
            <div class="column clickable" id="change-view">
                <ul {{items}} template={{dynamic}}/>
            </div>
        </div>
        <div>
            <button class="add">Add pluto</button>
            <button class="del">Delete planet</button>
        </div>
        `
    }

    @Transformer() size = (arr: any[]) => arr.length
    even = () => (item: ListItem, idx: number) => idx % 2 === 0
    toClass = (arr: any[]) => `array-${arr.length}`
    pOrM = (arr: ListItem[]) => arr.reduce((p, c) => p + (/\)\s[pm]/i.test(c.text) ? 1 : 0), 0)
}
