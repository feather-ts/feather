import {expect} from 'chai'
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
