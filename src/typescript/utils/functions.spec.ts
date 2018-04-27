import {JSDOM} from 'jsdom'
import {expect} from 'chai'
import {compose, isDef, isFunction, isUndef} from './functions'

describe('Function helpers', () => {

    it('should compose functions', () => {
        const g = (x) => x * 2
        const f = (x) => x + 1
        const c = compose([g, f])
        expect(c(2)).to.be.equal(5)
    })

    it('should detect functions', () => {
        expect(isFunction(() => 0)).to.be.true
        expect(isFunction(1)).to.be.false
        expect(isFunction({})).to.be.false
        expect(isFunction([])).to.be.false
    })

    it('should detect defined', () => {
        expect(isDef(undefined)).to.be.false
        expect(isDef(1)).to.be.true
        expect(isUndef(undefined)).to.be.true
        expect(isUndef(1)).to.be.false
    })
})
