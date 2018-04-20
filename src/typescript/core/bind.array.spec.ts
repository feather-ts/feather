import {JSDOM} from 'jsdom'
import {expect} from 'chai'
import {start} from '../decorators/construct'
import '../demo/app'
import {ListItem} from '../demo/list-item'

let doc, app
beforeEach(() => {
    doc = new JSDOM(`<div class="application"/>`).window.document.documentElement
    const widgets = start(doc)
    app = widgets[0]
})

describe('Array bindings', () => {

    it('should render unfiltered list', () => {
        const items = () => doc.querySelectorAll('#unfiltered-items > li')
        expect(items().length).to.be.equal(2)
        app.items.push(new ListItem('Anything', 'icon'))
        expect(items().length).to.be.equal(3)
        expect(app.items.length).to.be.equal(3)
        expect((items()[0]).querySelector('ul')).to.be.not.null
    })

    it('should render unfiltered list alternative', () => {
        const items = () => doc.querySelectorAll('#unfiltered-items-alternative > li')
        expect(items().length).to.be.equal(2)
        app.items.push(new ListItem('Anything', 'icon'))
        expect(items().length).to.be.equal(3)
        expect(app.items.length).to.be.equal(3)
        expect((items()[0]).querySelector('ul')).to.be.null
    })

    it('should render filtered list', () => {
        const items = () => doc.querySelectorAll('#filtered-items > li')
        expect(items().length).to.be.equal(1)
        app.items.push(new ListItem('Anything', 'icon'))
        expect(items().length).to.be.equal(2)
        app.items.push(new ListItem('Banything', 'icon'))
        expect(items().length).to.be.equal(2)
        expect(app.items.length).to.be.equal(4)
    })
})
