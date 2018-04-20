import {JSDOM} from 'jsdom'
import {expect} from 'chai'
import {start} from './construct'
import * as fetchMock from 'fetch-mock'
import '../demo/app'

let doc, app
beforeEach(() => {
    doc = new JSDOM(`<div class="application"/>`).window.document.documentElement
    const widgets = start(doc)
    app = widgets[0]
})

before(() => {
    fetchMock.mock('/get.json', {result: 'get'})
    fetchMock.mock('/post.json', {result: 'post'})
    fetchMock.mock('/delete.json', {result: 'delete'})
    fetchMock.mock('/put.json', {result: 'put'})
})

describe('Fetch', () => {

    it('should receive @Get correctly', async () => {
        const result = await app.get()
        expect(result).to.have.property('result', 'get')
    })

    it('should receive @Post correctly', async () => {
        const result = await app.post(app.flower)
        expect(result).to.have.property('result', 'post')
    })

    it('should receive @Put correctly', async () => {
        const result = await app.put(app.flower)
        expect(result).to.have.property('result', 'put')
    })

    it('should receive @Delete correctly', async () => {
        const result = await app.del()
        expect(result).to.have.property('result', 'delete')
    })
})
