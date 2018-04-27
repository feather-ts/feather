import {expect} from 'chai'
import '../demo/custom-component'
import {Construct, start, Widget} from './construct'
import {getFragment, Template} from './template'
import {render} from '../core/bind'
import {TemplateNode} from './template-node'

@Construct({selector: '.template-node'})
export class TemplateNodeWidget implements Widget {

    @TemplateNode('input') input: HTMLInputElement

    init = (el: Element) => render(this, el)

    @Template()
    markup() {
        return `
            <div><input></div>
        `
    }
}

describe('Template node', () => {

    it('should inject templates nodes after render', () => {
        const doc = getFragment('<div class="template-node"/>')
        const [aw] = start(doc as any) as TemplateNodeWidget[]

        expect(aw.input).to.be.a('HTMLInputElement')
    })
})

