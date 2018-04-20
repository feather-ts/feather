import {JSDOM} from 'jsdom'
import {expect} from 'chai'
import {deepValue, getSubset, isObject, merge} from './objects'

describe('Object helpers', () => {

    it('getSubset', () => {
        const obj = {
            a: 1,
            b: 2,
            c: 3
        }
        expect(getSubset(['a', 'c'], obj)).to.be.deep.equal({a: 1, c: 3})
    })

    it('isObject', () => {
        expect(isObject({})).to.be.true
        expect(isObject(new Date())).to.be.false
        expect(isObject([])).to.be.false
        expect(isObject(1)).to.be.false
        expect(isObject(true)).to.be.false
    })

    it('deepValue', () => {
        const obj = {
            a: {
                a: 1,
                b: () => 0,
                c: 3
            }
        }
        expect(deepValue(obj, '')).to.be.equal(obj)
        expect(deepValue(obj, 'a.a')).to.be.equal(1)
        expect(deepValue(obj, 'a.d')).to.be.undefined
        expect(deepValue(obj, 'a.b')).to.be.a('function')
    })

    it('merge', () => {
        const obj1 = {
            a: {
                a: 1,
                b: [1, 2],
                c: {
                    a: 1
                }
            }
        }
        const obj2 = {
            a: {
                a: 2,
                b: [3],
                c: {
                    b: 2
                }
            }
        }
        expect(merge(obj1, obj2)).to.be.deep.equal({
            a: {
                a: 2,
                b: [1, 2, 3],
                c: {
                    a: 1,
                    b: 2
                }
            }
        })
    })

})
