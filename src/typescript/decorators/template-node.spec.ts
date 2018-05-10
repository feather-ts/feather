import {expect} from 'chai'
import '../demo/custom-component'
import {ArrayWidget, Construct, start, Widget} from './construct'
import {getFragment, Template} from './template'
import {render} from '../core/bind'
import {TemplateNode} from './template-node'

@Construct({selector: '.template-node'})
class TemplateNodeWidget implements Widget {

    @TemplateNode('input') input: HTMLInputElement
    children: TemplateNodeArrayWidget[] = []

    init = (el: Element) => render(this, el)

    @Template()
    markup() {
        return `<div><input><ul {{children}}/></div>`
    }
}

class TemplateNodeArrayWidget implements ArrayWidget {

    @TemplateNode('span') span: HTMLInputElement

    @Template()
    markup() {
        return `<li><span/></li>`
    }
}

describe('Template node', () => {

    it('should inject templates nodes after render', () => {
        const doc = getFragment('<div class="template-node"/>')
        const [aw] = start(doc) as TemplateNodeWidget[]
        expect(aw.input).to.be.a('HTMLInputElement')
    })

    it('should inject templates nodes after array push', () => {
        const doc = getFragment('<div class="template-node"/>')
        const [aw] = start(doc) as TemplateNodeWidget[]
        aw.children.push(new TemplateNodeArrayWidget())
        expect(aw.children[0].span).to.be.a('HTMLSpanElement')
    })
})

