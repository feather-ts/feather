import {JSDOM} from 'jsdom'
import {expect} from 'chai'
import {observeArray, range, removeFromArray} from './arrays'
import * as Sinon from 'sinon'

describe('Array helpers', () => {

    it('should remove correctly', () => {
        const array = [1, 2, 3, 4, 5]
        expect(removeFromArray([...array], [1, 2, 3])).to.deep.equal([4, 5])
        expect(removeFromArray([...array], [4, 5])).to.deep.equal([1, 2, 3])
        expect(removeFromArray([...array], [1, 3, 5])).to.deep.equal([2, 4])
    })

    it('should create range', () => {
        expect(range(1, 5)).to.deep.equal([1, 2, 3, 4, 5])
        expect(range(2, 4)).to.deep.equal([2, 3, 4])
    })

    it('should observe array (push)', () => {
        const arr = range(1, 5)
        const listener = {
            sort: () => 0,
            splice: () => 0
        }
        const spliceSpy = Sinon.spy(listener, 'splice')
        observeArray(arr, listener)

        expect(arr.push(6, 7)).to.be.equal(7)
        expect(spliceSpy.args[0][0]).to.be.equal(5)
        expect(spliceSpy.args[0][1]).to.be.equal(0)
        expect(spliceSpy.args[0][2]).to.be.deep.equal([6, 7])
        expect(spliceSpy.args[0][3]).to.be.deep.equal([])
    })

    it('should observe array (unshift)', () => {
        const arr = range(1, 5)
        const listener = {
            sort: () => 0,
            splice: () => 0
        }
        const spliceSpy = Sinon.spy(listener, 'splice')
        observeArray(arr, listener)

        expect(arr.unshift(6, 7)).to.be.equal(7)
        expect(spliceSpy.args[0][0]).to.be.equal(0)
        expect(spliceSpy.args[0][1]).to.be.equal(0)
        expect(spliceSpy.args[0][2]).to.be.deep.equal([6, 7])
        expect(spliceSpy.args[0][3]).to.be.deep.equal([])
    })

    it('should observe array (pop)', () => {
        const arr = range(1, 5)
        const listener = {
            sort: () => 0,
            splice: () => 0
        }
        const spliceSpy = Sinon.spy(listener, 'splice')
        observeArray(arr, listener)

        expect(arr.pop()).to.be.equal(5)
        expect(spliceSpy.args[0][0]).to.be.equal(4)
        expect(spliceSpy.args[0][1]).to.be.equal(1)
        expect(spliceSpy.args[0][2]).to.be.deep.equal([])
        expect(spliceSpy.args[0][3]).to.be.deep.equal([5])
    })

    it('should observe array (shift)', () => {
        const arr = range(1, 5)
        const listener = {
            sort: () => 0,
            splice: () => 0
        }
        const spliceSpy = Sinon.spy(listener, 'splice')
        observeArray(arr, listener)

        expect(arr.shift()).to.be.equal(1)
        expect(spliceSpy.args[0][0]).to.be.equal(0)
        expect(spliceSpy.args[0][1]).to.be.equal(1)
        expect(spliceSpy.args[0][2]).to.be.deep.equal([])
        expect(spliceSpy.args[0][3]).to.be.deep.equal([1])
    })

    it('should observe array (splice)', () => {
        const arr = range(1, 5)
        const listener = {
            sort: () => 0,
            splice: () => 0
        }
        const spliceSpy = Sinon.spy(listener, 'splice')
        observeArray(arr, listener)

        expect(arr.splice(1, 3, 1, 2)).to.be.deep.equal([2, 3, 4])
        expect(spliceSpy.args[0][0]).to.be.equal(1)
        expect(spliceSpy.args[0][1]).to.be.equal(3)
        expect(spliceSpy.args[0][2]).to.be.deep.equal([1, 2])
        expect(spliceSpy.args[0][3]).to.be.deep.equal([2, 3, 4])
        expect(arr).to.be.deep.equal([1, 1, 2, 5])
    })

    it('should observe array (reverse)', () => {
        const arr = range(1, 5)
        const listener = {
            sort: () => 0,
            splice: () => 0
        }
        const sortSpy = Sinon.spy(listener, 'sort')
        observeArray(arr, listener)

        arr.reverse()
        expect(arr).to.be.deep.equal([5, 4, 3, 2, 1])
        expect(sortSpy.args[0][0]).to.be.deep.equal([4, 3, 2, 1, 0])
    })

    it('should observe array (sort)', () => {
        const arr = [4, 2, 5, 1, 3]
        const listener = {
            sort: () => 0,
            splice: () => 0
        }
        const sortSpy = Sinon.spy(listener, 'sort')
        observeArray(arr, listener)
        arr.sort((a, b) => a - b)
        expect(arr).to.be.deep.equal([1, 2, 3, 4, 5])
        expect(sortSpy.args[0][0]).to.be.deep.equal([3, 1, 4, 0, 2])
    })

})
