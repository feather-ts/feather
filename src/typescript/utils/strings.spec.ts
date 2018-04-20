import {JSDOM} from 'jsdom'
import {expect} from 'chai'
import {compose, isDef, isFunction, isUndef, throttle} from './functions'
import {range} from './arrays'
import * as Sinon from 'sinon'
import {decapitalize, format} from './strings'

describe('Strings helpers', () => {

    it('should format correctly', () => {
        const obj = {
            a: {
                a: 1,
                b: () => 0,
                c: 3
            }
        }
        const str = ' {{a.a}} {{a.c}} '
        expect(format(str, obj)).to.be.equal(' 1 3 ')
    })

    it('should decapitalize correctly', () => {
        const str = 'AnDreas'
        expect(decapitalize(str)).to.be.equal('anDreas')
    })

})
