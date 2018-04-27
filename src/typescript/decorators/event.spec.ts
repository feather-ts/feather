import {expect} from 'chai'
import * as Sinon from 'sinon'
import {Construct, start, Widget} from './construct'
import {getFragment, Template} from './template'
import {findWidget, render} from '../core/bind'
import {On} from './event'

@Construct({selector: 'div.event2'})
class EventWidget2 implements Widget {

    init(el) {
        render(this, el)
    }

    @On({event: 'click'})
    rootClick() {
    }

    @On({event: 'click', selector: '.click1'})
    button1Click() {
    }

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
class EventWidget1 implements Widget {

    init = (el) => render(this, el)

    @On({event: 'click'})
    rootClick() {
    }

    @On({event: 'click', selector: '.click1'})
    button1Click() {
    }

    @On({event: 'click', selector: '.click2'})
    button2Click() {
    }

    @Template()
    markup() {
        return `
        <div class="wrap">
            <button class="click1"></button>
            <button class="click2"></button>
            <div class="event2"></div>
        </div>
        `
    }
}

describe('Event', () => {

    it('should register simple clicks', () => {
        const div = getFragment('<div class="event"></div>')
        const [cw1] = start(div) as EventWidget1[]
        expect(div.querySelector('.event2 .click1')).to.not.be.null

        const cw2 = findWidget(cw1, EventWidget2)

        const mouseEvent = new MouseEvent('click', {bubbles: true, cancelable: true, scoped: false})
        const spy1 = Sinon.spy(cw1, 'rootClick'),
              spy2 = Sinon.spy(cw1, 'button1Click'),
              spy3 = Sinon.spy(cw1, 'button2Click'),
              spy4 = Sinon.spy(cw2, 'button1Click'),
              spy5 = Sinon.spy(cw2, 'button2Click')
        const wrap   = div.querySelector('.wrap'),
              click1 = div.querySelector('.click1'),
              click2 = div.querySelector('.click2')
        wrap.dispatchEvent(mouseEvent)
        click1.dispatchEvent(mouseEvent)
        click2.dispatchEvent(mouseEvent)
        expect(wrap).to.not.be.null
        expect(spy1.calledThrice).to.be.true
        expect(spy1.alwaysCalledWith(mouseEvent)).to.be.true

        expect(spy2.calledOnce).to.be.true
        expect(spy3.calledOnce).to.be.true

        const click3 = div.querySelector('.event2 .click1')
        click3.dispatchEvent(mouseEvent)
        expect(spy4.calledOnce).to.be.true
        expect(spy2.calledOnce).to.be.false

        const click4 = div.querySelector('.event2 .click2')
        click4.dispatchEvent(mouseEvent)
        expect(spy5.calledOnce).to.be.true
        expect(spy3.calledOnce).to.be.true // is stopped in class
    })

})

