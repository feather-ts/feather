import {expect} from 'chai'
import * as Sinon from 'sinon'
import {Construct, ConstructRegistry, runConstructorQueue, Singletons, start, Widget} from './construct'
import {getFragment, Template} from './template'

@Construct({selector: 'div.construct', singleton: true})
class ConstructWidget implements Widget {
    init(el: Element) {
    }

    @Template()
    markup() {
        return ''
    }
}

describe('Construct', () => {

    it('should register via @Construct()', () => {
        const cw = new ConstructWidget()
        const spy = Sinon.spy(cw, 'init')
        const div = document.createElement('div')
        runConstructorQueue(cw, div)
        expect(ConstructRegistry['div.construct']).to.be.equals(ConstructWidget)
        expect(Singletons['constructWidget']).to.be.equals(cw)
        expect(spy.calledOnce).to.be.true
        expect(spy.calledWith(div)).to.be.true
    })


    it('should register via selector', () => {
        const div = getFragment('<div><div class="construct"/></div>').firstElementChild
        const [cw] = start(div)
        expect(cw.constructor.name).to.be.equal('ConstructWidget')
    })

})

