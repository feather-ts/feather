import {ListItem} from './list-item'
import {Route} from '../decorators/router'
import {Computed} from '../decorators/computed'
import {Transformer} from '../decorators/transformer'
import {Template} from '../decorators/template'
import {Construct, Widget} from '../decorators/construct'
import {render} from '../core/bind'
import {On} from '../decorators/event'
import './responsive'
import './icon'
import './list-item'
import {Delete, Get, Post, Put} from '../decorators/fetch'

@Construct({selector: '.application', singleton: true})
export class MyApp implements Widget {

    items = [
        new ListItem('Apple', 'Red'),
        new ListItem('Banana', 'Yellow')
    ]

    name = 'hallo'

    flower = {
        name: 'Rose',
        icon: 'fa-flower',
        owner: {
            firstname: 'Peter',
            lastname: 'Pan'
        },
        toggle: true
    }

    init(el: Element) {
        render(this, el)
    }

    @Route('/')
    rootRoute() {
        console.log('root route')
    }

    @On({selector: '#item-size'})
    click() {
        this.flower.icon = 'tulip'
        this.items.push(new ListItem('Anything', 'icon'))
    }

    @On({event: 'click', selector: '#computed-value'})
    clickDel() {
        this.items.pop()
    }

    @Get({url: '/get.json'})
    async get(res: any) {
        return res
    }

    @Post({url: '/post.json'})
    async post(res: any, post: any) {
        return res
    }

    @Delete({url: '/delete.json'})
    async del(res: any) {
        return res
    }

    @Put({url: '/put.json'})
    async put(res: any) {
        return res
    }

    @Template()
    markup() {
        return `
            <span id="simple-string">{{flower.name}}</span>
            <span id="string-transformed" class="{{flower.name}}" data-toggler="{{flower.toggle}}">{{name:uppercase}}</span>
            <icon id="attribute-pass-through" icon={{flower.icon}}/>
            <ul id="unfiltered-items-alternative" {{items}} template="alternative"/>
            <ul id="unfiltered-items" {{items}}/>
            <ul id="filtered-items" {{items:startsWithA}}/>
            <span id="computed-value">{{computedValue:lowercase}}</span>
            <span id="item-size">Size {{items:size}}</span>
            <span id="item-size">Click</span>
            <responsive class="{{flower.icon}}"/>`
    }

    @Computed('flower.owner.firstname', 'flower.owner.lastname')
    computedValue = () => `${this.flower.owner.firstname} ${this.flower.owner.lastname}`

    @Transformer()
    startsWithA = () => (item: ListItem) => item.text.startsWith('A')

    @Transformer()
    uppercase = (val: string) => val.toUpperCase()

    @Transformer()
    size = (arr: any[]) => arr.length

    lowercase = (str: string) => str.toLowerCase()
}
