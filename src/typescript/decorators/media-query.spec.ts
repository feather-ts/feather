import {expect} from 'chai'
import '../demo/custom-component'
import * as Sinon from 'sinon'
import {ArrayWidget, runConstructorQueue} from './construct'
import {MediaQuery} from './media-query'

export class MediaQueryWidget implements ArrayWidget {

    @MediaQuery('(max-width: 768px)')
    mobile() {
    }

    @MediaQuery('(min-width: 769px)')
    desktop() {
    }
}

describe('Media Query', () => {

    it('should trigger methods', () => {
        const div = document.createElement('div')
        const save = new MediaQueryWidget()
        const mobile = Sinon.spy(save, 'mobile')
        const desktop = Sinon.spy(save, 'desktop')
        runConstructorQueue(save, div)

        expect(desktop.calledOnce).to.be.true
        expect(mobile.calledOnce).to.be.false
        window.resizeTo(320, 200)
        expect(desktop.calledOnce).to.be.true
        expect(mobile.calledOnce).to.be.true
    })
})

