import {JSDOM} from 'jsdom'
import {expect} from 'chai'
import {start} from './construct'
import * as Sinon from 'sinon'
import '../demo/app'

let doc, app
beforeEach(() => {
    doc = new JSDOM(`<div class="application"/>`).window.document.documentElement
    const widgets = start(doc)
    app = widgets[0]
})

const click = (el: Element) => {
    const event = document.createEvent('HTMLEvents')
    event.initEvent('click', true, true)
    el.dispatchEvent(event)
}

describe('Event bindings', () => {
    it('should receive events once', () => {
        const clickable = doc.querySelector('#item-size')
        const spy = Sinon.spy(app, 'click')
        click(clickable)
        expect(spy.thisValues[0]).to.be.equal(app)
        expect(spy.calledOnce).to.be.true
        expect(spy.args[0][0]).to.be.a('Event')
        expect(spy.args[0][1]).to.be.a('HTMLSpanElement')
    })
})
