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

    it('break apart text nodes', () => {
        const doc = getFragment('<div>{{this}} {{is}} a text {{apart}}{{test}}</div>')
        const div = breakApartTextNodes(doc).querySelector('div')
        expect(div.childNodes.length).to.be.equal(6)
        expect(div.childNodes[0].textContent).to.be.equal('{{this}}')
        expect(div.childNodes[1].textContent).to.be.equal(' ')
        expect(div.childNodes[2].textContent).to.be.equal('{{is}}')
        expect(div.childNodes[3].textContent).to.be.equal(' a text ')
        expect(div.childNodes[4].textContent).to.be.equal('{{apart}}')
        expect(div.childNodes[5].textContent).to.be.equal('{{test}}')
    })

    it('should assign info curly', () => {
        const info = new TemplateTokenInfo(1, TemplateTokenType.ATTRIBUTE)
        info.setCurly('property.a.b.c:method1:method2')
        expect(info.path()).to.be.equal('property.a.b.c')
        expect(info.transformers()).to.be.deep.equal(['method1', 'method2'])
    })

    it('should parse template correctly', () => {
        const template = parseTemplate(templateSpecTemplate)
        expect(template.infos.length).to.be.equal(11)
        expect(template.infos[0].type).to.be.equal(TemplateTokenType.CLASS)
        expect(template.infos[1].type).to.be.equal(TemplateTokenType.PROPERTY)
        expect(template.infos[2].type).to.be.equal(TemplateTokenType.ATTRIBUTE)
        expect(template.infos[3].type).to.be.equal(TemplateTokenType.TEXT)
        expect(template.infos[4].type).to.be.equal(TemplateTokenType.TAG)
        expect(template.infos[5].type).to.be.equal(TemplateTokenType.CLASS)
        expect(template.infos[6].type).to.be.equal(TemplateTokenType.PROPERTY)
        expect(template.infos[7].type).to.be.equal(TemplateTokenType.ATTRIBUTE)
        expect(template.infos[8].type).to.be.equal(TemplateTokenType.TEXT)
        expect(template.infos[9].type).to.be.equal(TemplateTokenType.TAG)
        expect(template.infos[10].type).to.be.equal(TemplateTokenType.TEMPLATE)
    })

    it('should preserve case', () => {
        const template = parseTemplate(templateSpecTemplate)
        expect(template.infos[1].path()).to.be.equal('propHook.aA.bB.cB')
        expect(template.infos[1].transformers()).to.be.deep.equal(['upperCase', 'lowerCase'])
    })

    it('should clone template ', () => {
        const template = parseTemplate('<div template={{a}}><span test="{{a}}" {{a}}>{{a}}</span></div>')
        const clone = template.clone()
        expect(clone.nodes.length).to.be.equal(4)
        expect(clone.nodes[0]).to.be.a('DocumentFragment')
        expect(clone.nodes[1].tagName).to.be.equal('DIV')
        expect(clone.nodes[2].tagName).to.be.equal('SPAN')
        expect(clone.infos.length).to.be.equal(4)
    })

})

