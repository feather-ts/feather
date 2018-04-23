import {EventWidget1, EventWidget2} from '../demo/event-helper'
import {expect} from 'chai'
import * as Sinon from 'sinon'
import {start} from './construct'
import {getFragment} from './template'
import {findWidget} from '../core/bind'

describe('Event', () => {

    it('should register simple clicks', () => {
        const div   = getFragment('<div class="event"/>')
        const [cw1] = start(div) as EventWidget1[]
        const  cw2  = findWidget(cw1, EventWidget2)

        const mouseEvent = new MouseEvent('click', {bubbles: true, cancelable: true, scoped: false})
        const spy1 = Sinon.spy(cw1, 'rootClick'),
              spy2 = Sinon.spy(cw1, 'button1Click'),
              spy3 = Sinon.spy(cw1, 'button2Click'),
              spy4 = Sinon.spy(cw2, 'button1Click'),
              spy5 = Sinon.spy(cw2, 'button2Click')
        const p = div.querySelector('p'),
              click1 = div.querySelector('.click1'),
              click2 = div.querySelector('.click2')
        p.dispatchEvent(mouseEvent)
        click1.dispatchEvent(mouseEvent)
        click2.dispatchEvent(mouseEvent)
        expect(p).to.not.be.null
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

