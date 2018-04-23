import {expect} from 'chai'
import '../demo/custom-component'
import {registerCleanUp} from './cleanup'
import * as Sinon from 'sinon'

describe('Cleanup', () => {

    it('should run cleanup queue', () => {
        const cleanUp = Sinon.spy(() => 0)
        const div = document.createElement('div')
        registerCleanUp(div, cleanUp)
        cleanUp(div)
        expect(cleanUp.calledOnce).to.be.true
    })

})

