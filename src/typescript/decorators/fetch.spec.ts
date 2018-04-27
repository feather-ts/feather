import {expect} from 'chai'
import {Construct, runConstructorQueue, Widget} from './construct'
import {Template} from './template'
import {FetchError, Get, Post} from './fetch'
import * as fetchMock from 'fetch-mock'
import Sinon = require('sinon')


before(() => {
    fetchMock.mock('/get.json', {result: 'get'})
    fetchMock.mock('/post.json', {result: 'post'})
    fetchMock.mock('/404.json', 404)
})


@Construct({selector: 'div.fetch'})
class FetchWidget implements Widget {

    init = (el) => 0

    @Get({url: '/get.json'})
    async fetch1() {
    }

    @Post({url: '/post.json'})
    async fetch2(postData?: any) {
    }

    @Post({url: '/404.json'})
    async fetchFail(postData?: any) {
    }

    @FetchError(404)
    fetchError404() {
    }

    @Template()
    markup() {
        return ``
    }
}


describe('Fetch', () => {

    it('should @Get', async () => {
        const fw = new FetchWidget()
        runConstructorQueue(fw, null)
        const getRes = await fw.fetch1()
        expect(getRes).to.be.deep.equal({result: 'get'})
    })

    it('should @Post', async () => {
        const fw = new FetchWidget()
        runConstructorQueue(fw, null)
        const postRes = await fw.fetch2({})
        expect(postRes).to.be.deep.equal({result: 'post'})
    })

    it('should @Post fail', async () => {
        const fw = new FetchWidget()
        const spy = Sinon.spy(fw, 'fetchError404')
        runConstructorQueue(fw, null)
        const postRes = await fw.fetchFail({})
        expect(postRes).to.be.undefined
        expect(spy.calledOnce).to.be.true
        expect(spy.calledOn(fw)).to.be.true
        expect(spy.args[0][0]).to.be.a('Error')
    })

})

