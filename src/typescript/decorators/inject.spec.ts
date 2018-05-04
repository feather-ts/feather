import {expect} from 'chai'
import {ArrayWidget, Construct, runConstructorQueue, Singletons, Widget} from './construct'
import {Template} from './template'
import {Inject} from './inject'

@Construct({selector: 'nope', singleton: true})
class SingletonWidget implements Widget {

    init = (el: Element) => 0

    @Template()
    nothing() {
        return ''
    }
}

class ReceiverWidget implements ArrayWidget {

    @Inject() singletonWidget: SingletonWidget

    @Template()
    nothing() {
        return ''
    }
}

describe('Inject', () => {

    it('should inject singletons', () => {
        const div = document.createElement('div')
        runConstructorQueue(new SingletonWidget(), div)
        const widget = new ReceiverWidget()
        runConstructorQueue(widget, div)
        expect(Singletons['singletonWidget']).to.not.be.undefined
        expect(widget.singletonWidget).to.not.be.undefined
        expect(widget.singletonWidget).to.not.be.a('SingletonWidget')
    })
})

