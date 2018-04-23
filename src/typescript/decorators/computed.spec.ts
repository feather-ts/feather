import {expect} from 'chai'
import '../demo/custom-component'
import * as Sinon from 'sinon'
import {ArrayWidget} from './construct'
import {Computed, createComputedListener} from './computed'
import {TemplateTokenInfo, TemplateTokenType} from './template'

class ComputedTestWidget implements ArrayWidget {

    prop1 = 'A'
    prop2 = 'B'

    @Computed('prop1', 'prop2')
    test() {
        return this.prop1 + this.prop2
    }
}

describe('Computed', () => {

    it('should register computed hooks', () => {
        const widget = new ComputedTestWidget()
        const info = new TemplateTokenInfo(0, TemplateTokenType.ATTRIBUTE)
        info.setCurly('test')
        const spy = Sinon.spy(widget, 'test')
        createComputedListener(widget, info, () => widget.test())
        widget.prop1 = 'C'
        widget.prop2 = 'D'
        expect(spy.callCount).to.be.equal(2)
        expect(spy.alwaysCalledOn(widget)).to.be.true
    })
})

