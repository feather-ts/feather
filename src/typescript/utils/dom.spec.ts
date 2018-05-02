import {expect} from 'chai'
import '../demo/custom-component'
import {allChildNodes, allTextNodes} from './dom'
import {getFragment} from '../decorators/template'

describe('Dom', () => {

    it('should collect all child nodes', () => {
        const str = `<div><span/>text 1<p/> <ul><li>text 2</li><li/></ul>text 2<span/> </div>`
        const frag = getFragment(str)
        const childNodes = allChildNodes(frag)
        expect(childNodes.length).to.be.equal(11)
        const textNodes = childNodes.reduce((p, c) => p + (c.nodeType === Node.TEXT_NODE ? 1 : 0), 0)
        expect(textNodes).to.be.equal(3)
        const normalNodes = childNodes.reduce((p, c) => p + (c.nodeType === Node.ELEMENT_NODE ? 1 : 0), 0)
        expect(normalNodes).to.be.equal(7)
        expect(childNodes[0]).to.be.equal(frag)
    })

    it('should collect all text nodes', () => {
        const str = `first<div>second<span>third</span><p>forth</p><span>fifth</span></div>sixth`
        const frag = getFragment(str)
        const childNodes = allTextNodes(frag)
        expect(childNodes.map(x => x.textContent)).to.be.deep.equal(['first', 'second', 'third', 'forth', 'fifth', 'sixth'])
    })

})

