import {breakApartTextNodes, getFragment, parseTemplate, TemplateTokenInfo, TemplateTokenType} from './template'
import {expect} from 'chai'
import '../demo/custom-component'

const templateSpecTemplate = `
<div class="{{classHook}}" {{propHook.aA.bB.cB:upperCase:lowerCase}} data={{attrHook}}>
    {{textHook}}
    <custom-component attr1={{passOn}} jsAttr2={1+1} func={{something}}/>
</div>
<div class="{{classHook2}}" {{propHook2}} data={{attrHook}}>
    {{textHook2}}
    <custom-component attr1={{passOn}} jsAttr2={1+1} func={{something}}/>
    <span template={{templateHook}}/>
</div>
`

describe('Templates', () => {

    it('should render table rows', () => {
        const doc = getFragment('<tr><td>text</td></tr>')
        expect(doc.firstElementChild.tagName).to.be.equal('TR')
    })

    it('break apart text nodes', () => {
        const doc = getFragment('<div>{{this}} {{is}} a text {{apart}}{{test}}</div>')
        const div = breakApartTextNodes(doc).querySelector('div')
        const nodes = div.childNodes
        expect(nodes.length).to.be.equal(6)
        expect(nodes[0].textContent).to.be.equal('{{this}}')
        expect(nodes[1].textContent).to.be.equal(' ')
        expect(nodes[2].textContent).to.be.equal('{{is}}')
        expect(nodes[3].textContent).to.be.equal(' a text ')
        expect(nodes[4].textContent).to.be.equal('{{apart}}')
        expect(nodes[5].textContent).to.be.equal('{{test}}')
    })

    it('should assign info curly', () => {
        const info = new TemplateTokenInfo(1, TemplateTokenType.ATTRIBUTE)
        info.setCurly('property.a.b.c:method1:method2')
        expect(info.path()).to.be.equal('property.a.b.c')
        expect(info.transformers()).to.be.deep.equal(['method1', 'method2'])
    })

    it('should parse template correctly', () => {
        const template = parseTemplate(templateSpecTemplate)
        const infos: TemplateTokenInfo[] = template.infos
        expect(infos.length).to.be.equal(11)
        expect(infos[0].type).to.be.equal(TemplateTokenType.CLASS)
        expect(infos[1].type).to.be.equal(TemplateTokenType.PROPERTY)
        expect(infos[2].type).to.be.equal(TemplateTokenType.ATTRIBUTE)
        expect(infos[3].type).to.be.equal(TemplateTokenType.TEXT)
        expect(infos[4].type).to.be.equal(TemplateTokenType.TAG)
        expect(infos[5].type).to.be.equal(TemplateTokenType.CLASS)
        expect(infos[6].type).to.be.equal(TemplateTokenType.PROPERTY)
        expect(infos[7].type).to.be.equal(TemplateTokenType.ATTRIBUTE)
        expect(infos[8].type).to.be.equal(TemplateTokenType.TEXT)
        expect(infos[9].type).to.be.equal(TemplateTokenType.TAG)
        expect(infos[10].type).to.be.equal(TemplateTokenType.TEMPLATE)
    })

    it('should preserve case', () => {
        const template = parseTemplate(templateSpecTemplate)
        expect(template.infos[1].path()).to.be.equal('propHook.aA.bB.cB')
        expect(template.infos[1].transformers()).to.be.deep.equal(['upperCase', 'lowerCase'])
    })

    it('should clone template ', () => {
        const template = parseTemplate('<div template={{a}}><span test="{{a}}" {{a}}>{{a}}</span></div>')
        const clone = template.clone()
        const nodes = clone.nodes
        expect(nodes.length).to.be.equal(4)
        expect(nodes[0]).to.be.a('DocumentFragment')
        expect((nodes[1] as Element).tagName).to.be.equal('DIV')
        expect((nodes[2] as Element).tagName).to.be.equal('SPAN')
        expect(clone.infos.length).to.be.equal(4)
    })

})

