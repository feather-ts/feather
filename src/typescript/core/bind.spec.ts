import {expect} from 'chai'
import '../demo/custom-component'
import {findWidget, render} from './bind'
import {ArrayWidget, Construct, start, Widget} from '../decorators/construct'
import {getFragment, Template} from '../decorators/template'
import {Computed} from '../decorators/computed'
import {CustomComponent} from '../demo/custom-component'
import Sinon = require('sinon')

class BindItem implements ArrayWidget {

    on: boolean

    constructor(on = true) {
        this.on = on
    }

    @Template()
    as() {
        return `* `
    }

    @Template('dash')
    asDash() {
        return `- `
    }

    @Template('onoff')
    asOnoff() {
        return `<li>{{on:toStr}}<li>`
    }

    toStr = (on: boolean) => on ? 'on' : 'off'
}

@Construct({selector: 'div.bind'})
class BindTestWidget implements Widget {

    arrayView: string
    arrHook: BindItem[] = [new BindItem(), new BindItem()]
    classHook = 'cls-a'
    classHook2 = 'cls-b'
    propHook = 'prop-hook-a'
    propHook2 = 'prop-hook-b'
    attrHook = 'attr-a'
    attrHook2 = 'attr-b'
    textHook = 'text-a'
    textHook2 = 'text-b'
    passOn = 'pass-on-a'
    templateHook = 'injected'
    passOnFunc = () => this.textHook

    init = (el) => render(this, el)

    @Template()
    markup() {
        return `
        <div class="{{classHook}}" {{propHook:upperCaseBind:plusA}} data={{attrHook}}>
            {{textHook}}
            <custom-component from-parent={{passOn}} raw-java-script={1+1} func={{passOnFunc}}/>
            <ul {{arrHook}}/>
        </div>
        <div class="{{classHook2}}" {{propHook2}} data={{attrHook2}}>
            {{textHook2}}
            <custom-component class="{{classHook2:plusA}}" from-parent={{passOn}} raw-java-script={1+1} func={{passOnFunc}}/>
            <span data-computed={{computed}} class="template-hook" template={{templateHook}}/>
            <ul {{arrHook}} template={{arrayView}}/>
            <span class="size">{{arrHook:size}}</span>
        </div>
        `
    }

    @Template('injected')
    injectedTemplate() {
        return 'Injected'
    }

    @Template('injected2')
    injectedTemplate2() {
        return 'Injected*'
    }

    @Computed('propHook', 'attrHook')
    computed() {
        return this.propHook + ' ' + this.attrHook
    }

    upperCaseBind = (str) => str.toUpperCase()
    plusA = (str) => str + 'A'
    size = (arr: any[]) => arr.length
}

@Construct({selector: 'div.array-bind'})
class ArrayBindTestWidget implements Widget {

    items: BindItem[] = []
    showActive = true

    init = (el: Element) => render(this, el)

    @Template()
    markup() {
        return `
        <ul {{items:filtered}} template="onoff"/>
        <span class="size">{{items:size}}</span>
        <span class="active" filter={{showActive}}>{{items:activeCount}}</span>
        `
    }

    size = (arr: BindItem[]) => arr.length
    filtered = () => (item: BindItem) => this.showActive === item.on
    activeCount = (arr: BindItem[]) => arr.reduce((p, c) => p + (c.on ? 1 : 0), 0)
}


describe('Bind', () => {

    it('should render complex template', () => {
        const doc = getFragment('<div class="bind"/>')
        start(doc as any)
        const div = doc.firstElementChild
        expect(div.firstElementChild.matches('.cls-a[prophook="PROP-HOOK-AA"][data="attr-a"]')).to.be.true
        expect(div.firstElementChild.textContent).to.have.string('text-a')

        expect(div.lastElementChild.matches('.cls-b[prophook2="prop-hook-b"][data="attr-b"]')).to.be.true
        expect(div.lastElementChild.textContent).to.have.string('text-b')

        expect(div.querySelectorAll('custom-component')[0].childElementCount).to.be.equal(2)
        expect(div.querySelectorAll('custom-component')[0].textContent).to.have.string('Passed on: pass-on-a and raw javascript: 2')
        expect(div.querySelectorAll('custom-component')[1].childElementCount).to.be.equal(2)
        expect(div.querySelectorAll('custom-component')[1].textContent).to.have.string('Passed on: pass-on-a and raw javascript: 2')
        expect(div.querySelectorAll('custom-component')[1].classList.contains('cls-bA')).to.be.true

        expect(div.querySelector('span.template-hook').textContent).to.have.string('Injected')
        expect(div.querySelector('span.template-hook').getAttribute('data-computed')).to.be.equal('prop-hook-a attr-a')

        expect(div.querySelectorAll('ul')[0].textContent).to.be.have.string('* * ')
        expect(div.querySelectorAll('ul')[1].textContent).to.be.have.string('* * ')

        expect(div.querySelector('span.size').textContent).to.have.string('2')
    })

    it('should change complex template', () => {
        const doc = getFragment('<div class="bind"/>')
        const [testWidget] = start(doc as any) as BindTestWidget[]
        const div = doc.firstElementChild

        testWidget.arrHook.push(new BindItem(), new BindItem())
        testWidget.classHook = 'cls-a-star'
        testWidget.classHook2 = 'cls-b-star'
        testWidget.propHook = 'prop-hook-a*'
        testWidget.propHook2 = 'prop-hook-b*'
        testWidget.attrHook = 'attr-a*'
        testWidget.attrHook2 = 'attr-b*'
        testWidget.textHook = 'text-a*'
        testWidget.textHook2 = 'text-b*'
        testWidget.passOn = 'pass-on-a*'
        testWidget.templateHook = 'injected2'
        testWidget.arrayView = 'dash'

        expect(div.firstElementChild.matches('.cls-a-star[prophook="PROP-HOOK-A*A"][data="attr-a*"]')).to.be.true
        expect(div.firstElementChild.textContent).to.have.string('text-a*')

        expect(div.lastElementChild.matches('.cls-b-star[prophook2="prop-hook-b*"][data="attr-b*"]')).to.be.true
        expect(div.lastElementChild.textContent).to.have.string('text-b*')

        expect(div.querySelectorAll('custom-component')[0].childElementCount).to.be.equal(2)
        expect(div.querySelectorAll('custom-component')[0].textContent).to.have.string('Passed on: pass-on-a* and raw javascript: 2')
        expect(div.querySelectorAll('custom-component')[1].childElementCount).to.be.equal(2)
        expect(div.querySelectorAll('custom-component')[1].textContent).to.have.string('Passed on: pass-on-a* and raw javascript: 2')

        expect(div.querySelector('span.template-hook').textContent).to.have.string('Injected*')
        expect(div.querySelector('span.template-hook').getAttribute('data-computed')).to.be.equal('prop-hook-a* attr-a*')

        expect(div.querySelectorAll('ul')[0].textContent).to.be.have.string('* * * * ')
        expect(div.querySelectorAll('ul')[1].textContent).to.be.have.string('- - - - ')

        expect(div.querySelector('span.size').textContent).to.have.string('4')
    })

    it('should have findable sub-widget', () => {
        const doc = getFragment('<div class="bind"/>')
        const [testWidget] = start(doc as any) as BindTestWidget[]
        const cc = findWidget(testWidget, CustomComponent)
        expect(cc).to.not.be.undefined
    })

    it('should have pass through function scope', () => {
        const doc = getFragment('<div class="bind"/>')
        const [testWidget] = start(doc as any) as BindTestWidget[]
        const cc = findWidget(testWidget, CustomComponent)
        const spy = Sinon.spy(cc, 'func')
        const res = cc.func()
        expect(spy.calledOnce).to.be.true
        expect(res).to.be.equal('text-a')
    })

    it('should handle complex array case', () => {
        const doc = getFragment('<div class="array-bind"/>')
        const [aw] = start(doc as any) as ArrayBindTestWidget[]

        const size = () => parseInt(doc.querySelector('.size').textContent, 10)
        const activeCount = () => parseInt(doc.querySelector('.active').textContent, 10)
        const domChildren = () => doc.querySelector('ul').childElementCount

        expect(size()).to.be.equal(0)

        aw.items.push(new BindItem(), new BindItem(), new BindItem(false))

        expect(domChildren()).to.be.equal(2)
        expect(size()).to.be.equal(3)
        expect(activeCount()).to.be.equal(2)

        aw.items[0].on = false
        expect(domChildren()).to.be.equal(1)
        expect(activeCount()).to.be.equal(1)

        aw.showActive = false
        expect(domChildren()).to.be.equal(2)
        expect(activeCount()).to.be.equal(1)
    })
})

