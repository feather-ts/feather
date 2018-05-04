import {expect} from 'chai'
import {ArrayWidget, Construct, start, Widget} from './construct'
import {getFragment, Template} from './template'
import {InArray} from './in-array'
import {render} from '../core/bind'

@Construct({selector: '.array-holder', singleton: true})
class ArrayHoldingWidget implements Widget {

    data: ReceiverWidget[] = [new ReceiverWidget()]

    init = (el: Element) => render(this, el)

    @Template()
    nothing() {
        return '<ul {{data}}/>'
    }
}

class ReceiverWidget implements ArrayWidget {

    @InArray() array: ReceiverWidget[]

    @Template()
    nothing() {
        return '<li></li>'
    }
}

describe('InArray', () => {

    it('should inject parent arrays', () => {
        const div = getFragment('<div class="array-holder"/>')
        const [ah] = start(div) as ArrayHoldingWidget[]
        expect(ah.data).to.be.a('Array')
        expect(ah.data[0].array).to.be.a('Array')
        ah.data.push(new ReceiverWidget())
        expect(ah.data[1].array).to.be.a('Array')
    })
})

