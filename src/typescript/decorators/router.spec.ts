import {expect} from 'chai'
import '../demo/custom-component'
import * as Sinon from 'sinon'
import {ArrayWidget, runConstructorQueue} from './construct'
import {navigate, Route, runRoutes} from './router'

interface SubRoute {
    path1: string
    path2: string
}

class RouteTestWidget implements ArrayWidget {

    prop1 = 'A'
    prop2 = 'B'

    @Route('/')
    root() {
        return this.prop1 + this.prop2
    }

    @Route('/subroute/:path1/:path2')
    subroute(r: SubRoute) {
    }
}

describe('Router', () => {

    it('should call root route', () => {
        const div = document.createElement('div')
        const widget = new RouteTestWidget()
        const root = Sinon.spy(widget, 'root')
        const subroute = Sinon.spy(widget, 'subroute')
        runConstructorQueue(widget, div)
        runRoutes()
        expect(root.calledOnce).to.be.true
        navigate('/subroute/1/2')
        expect(subroute.calledOnceWith({path1: '1', path2: '2'})).to.be.true
    })
})

