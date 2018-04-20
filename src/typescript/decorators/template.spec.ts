import {JSDOM} from 'jsdom'
import {expect} from 'chai'
import {start} from './construct'
import * as fetchMock from 'fetch-mock'
import '../demo/app'
import {openTags, parseTemplate, selfClosingTags, TemplateTokenType} from './template'

let doc, app
beforeEach(() => {
    doc = new JSDOM(`<div class="application"/>`).window.document.documentElement
    const widgets = start(doc)
    app = widgets[0]
})

describe('Templates', () => {

    it('Regexp works', () => {
        const r = selfClosingTags,
              o = openTags
        expect('<span/><span/>'.replace(r, o)).to.be.equal('<span></span><span></span>')
        expect('<bla><span/><span/></bla>'.replace(r, o)).to.be.equal('<bla><span></span><span></span></bla>')
        expect('<span {{bla}}/><span {{bla}}/><span {{bla}}/>'.replace(r, o)).to.be.equal('<span {{bla}}></span><span {{bla}}></span><span {{bla}}></span>')
        expect(' <ul id="filtered-list" {{filteredList:arrayFilter}} truthy="{{filteredList:countTruthy}}"/> '.replace(r, o))
            .to.be.equal(' <ul id="filtered-list" {{filteredList:arrayFilter}} truthy="{{filteredList:countTruthy}}"></ul> ')
        expect('<bla> <span/> <br><p/> <span/> </bla>'.replace(r, o)).to.be.equal('<bla> <span></span> <br><p></p> <span></span> </bla>')
        expect(`<bla x="2"><span a='span>' checked b='<aa' y=1 z="2" w='</>' j="<>"/><span y=1 z="2" w="</>" j="<>"/></bla>`.replace(r, o))
            .to.be.equal(`<bla x="2"><span a='span>' checked b='<aa' y=1 z="2" w='</>' j="<>"></span><span y=1 z="2" w="</>" j="<>"></span></bla>`)
    })

    it('Template splits text nodes correctly', () => {
        const str = '<div>first: {{bla}} second: {{blub}}</div>',
              parsed = parseTemplate(str)
        const childNodes = parsed.nodes[0].firstChild.childNodes
        expect(childNodes.length).to.be.equal(4)
        expect(childNodes[0].textContent).to.be.equal('first: ')
        expect(childNodes[1].textContent).to.be.equal('{{bla}}')
        expect(childNodes[2].textContent).to.be.equal(' second: ')
        expect(childNodes[3].textContent).to.be.equal('{{blub}}')
    })


    it('Template parses correctly with attributes', () => {
        const str = `
                    <AttributeWidget id="aw1" text="{'a'+'b'}" bool="{true}" func="{this.printStuff}" number="{3}"/>
                    <AttributeWidget id="aw2" text={this.printStuff()} bool={false} func={this.printStuff} number={4}/>
                `,
            parsed = parseTemplate(str)
        expect(parsed.nodes[0].children.length).to.be.equal(2)
        expect(parsed.nodes[0].children[0].getAttribute('number')).to.be.equal('{3}')
        expect(parsed.nodes[0].children[1].getAttribute('number')).to.be.equal('{4}')
    })

    it('Template parses hooks', () => {
        const str = '<AttributeWidget {{hook1}} bla="{{hook2}}" class="bub {{hook3}}">in {{hook4}} text</AttributeWidget>',
            parsed = parseTemplate(str)
        expect(parsed.infos.length).to.be.equal(4)
        expect(parsed.infos[0].curly()).to.be.equal('hook1')
        expect(parsed.infos[0].attribute).to.be.undefined
        expect(parsed.infos[0].type).to.be.equal(TemplateTokenType.PROPERTY)

        expect(parsed.infos[1].curly()).to.be.equal('hook2')
        expect(parsed.infos[1].attribute).to.be.equal('bla')
        expect(parsed.infos[1].type).to.be.equal(TemplateTokenType.ATTRIBUTE)

        expect(parsed.infos[2].curly()).to.be.equal('hook3')
        expect(parsed.infos[2].attribute).to.be.undefined
        expect(parsed.infos[2].type).to.be.equal(TemplateTokenType.CLASS)

        expect(parsed.infos[3].curly()).to.be.equal('hook4')
        expect(parsed.infos[3].attribute).to.be.undefined
        expect(parsed.infos[3].type).to.be.equal(TemplateTokenType.TEXT)
    })
})
