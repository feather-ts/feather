import {JSDOM} from 'jsdom'
import {expect} from 'chai'
import {start} from '../decorators/construct'
import {allChildNodes, allTextNodes} from './dom'

let doc, app
beforeEach(() => {
    doc = new JSDOM(`<div class="application"/>`).window.document.documentElement
    const widgets = start(doc)
    app = widgets[0]
})

describe('Dom helpers', () => {

    it('should collect child nodes', () => {
        const root = doc.querySelector('#attribute-pass-through')
        const items = allChildNodes(root)
        expect(items.length).to.be.equal(3)
        expect(items.includes(root)).to.be.true
    })

    it('should collect text nodes', () => {
        const root = doc.querySelector('#attribute-pass-through')
        const items = allTextNodes(root)
        expect(items.length).to.be.equal(1)
        expect(items[0].textContent).to.be.equal('fa-flower')
    })

})
