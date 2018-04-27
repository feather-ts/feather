import {expect} from 'chai'
import '../demo/custom-component'
import {Construct, start, Widget} from './construct'
import {getFragment, Template} from './template'
import {Transformer, TransformerRegistry} from './transformer'
import {render} from '../core/bind'

@Construct({selector: '.transformer'})
export class TransformerWidget implements Widget {

    init = (el: Element) => render(this, el)

    @Template()
    markup() {
        return `
            <div><input></div>
        `
    }

    @Transformer()
    testTransformer = () => true
}

describe('Transformer', () => {

    it('should register transformer', () => {
        const doc = getFragment('<div class="transformer"/>')
        start(doc as any) as TransformerWidget[]
        expect(TransformerRegistry['testTransformer']).to.not.be.undefined
    })
})

