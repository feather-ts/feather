import {Template} from '../decorators/template'
import {render} from '../core/bind'
import {On} from '../decorators/event'
import {Construct, Widget} from '../decorators/construct'

@Construct({selector: 'div.event2'})
export class EventWidget2 implements Widget {

    init = (el) => render(this, el)

    @On({event: 'click'})
    rootClick() {}

    @On({event: 'click', selector: '.click1'})
    button1Click() {}

    @On({event: 'click', selector: '.click2'})
    button2Click(ev) {
        ev.stopPropagation()
    }

    @Template()
    markup() {
        return `
        <span>
            <button class="click1"/>
            <button class="click2"/>
        </span>
        `
    }
}

@Construct({selector: 'div.event'})
export class EventWidget1 implements Widget {

    init = (el) => render(this, el)

    @On({event: 'click'})
    rootClick() {}

    @On({event: 'click', selector: '.click1'})
    button1Click() {}

    @On({event: 'click', selector: '.click2'})
    button2Click() {}

    @Template()
    markup() {
        return `
        <p>
            <button class="click1"/>
            <button class="click2"/>
            <div class="event2"/>
        </p>
        `
    }
}
