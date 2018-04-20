import {JSDOM} from 'jsdom'
import {expect} from 'chai'
import {start} from '../decorators/construct'
import '../demo/app'

let doc, app
beforeEach(() => {
    doc = new JSDOM(`<div class="application"/>`).window.document.documentElement
    const widgets = start(doc)
    app = widgets[0]
})

describe('Basic bindings', () => {
    it('should render template content', () => {
        const app = doc.querySelector('.application')
        expect(app.children.length > 1).to.be.true
    })

    it('should render simple strings', () => {
        const str = doc.querySelector('#simple-string')
        expect(str.textContent).to.be.equal('Rose')
        app.flower.name = 'Tulip'
        expect(str.textContent).to.be.equal('Tulip')
    })

    it('should transform simple strings', () => {
        const transformed = doc.querySelector('#string-transformed')
        expect(transformed.textContent).to.be.equal('HALLO')
        app.name = 'hello'
        expect(transformed.textContent).to.be.equal('HELLO')
    })

    it('should bind classes', () => {
        const transformed = doc.querySelector('#string-transformed')
        expect(transformed.classList.contains('Rose')).to.be.true
        app.flower.name = undefined
        expect(transformed.classList.contains('Rose')).to.be.false
        app.flower.name = 'Tulip'
        expect(transformed.classList.contains('Tulip')).to.be.true
    })

    it('should bind boolean attribute', () => {
        const toggler = doc.querySelector('#string-transformed')
        expect(toggler.getAttribute('data-toggler')).to.not.be.null
        app.flower.toggle = false
        expect(toggler.getAttribute('data-toggler')).to.be.null
    })

    it('should pass through attributes to sub-widgets', () => {
        const passThrough = doc.querySelector('#attribute-pass-through')
        expect(passThrough.children.length).to.be.equal(1)
        const icon = passThrough.firstElementChild
        expect(icon.classList.contains('fa-flower')).to.be.true
        expect(icon.textContent).to.be.equal('fa-flower')
        app.flower.icon = 'fa-plant'
        expect(icon.classList.contains('fa-plant')).to.be.true
        expect(icon.textContent).to.be.equal('fa-plant')
    })

    it('should render computed', () => {
        const comp = doc.querySelector('#computed-value')
        expect(comp.textContent).to.be.equal('peter pan')
        app.flower.owner.firstname = 'Captain'
        expect(comp.textContent).to.be.equal('captain pan')
        app.flower.owner.lastname = 'Hook'
        expect(comp.textContent).to.be.equal('captain hook')
    })

    it('should set class on child component', () => {
        const comp = doc.querySelector('responsive')
        expect(comp.classList.contains('fa-flower')).to.be.true
        app.flower.icon = 'tulip'
        expect(comp.classList.contains('fa-flower')).to.be.false
        expect(comp.classList.contains('tulip')).to.be.true
    })
})
