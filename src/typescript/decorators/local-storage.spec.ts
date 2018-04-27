import {expect} from 'chai'
import '../demo/custom-component'
import * as Sinon from 'sinon'
import {ArrayWidget, runConstructorQueue, Widget} from './construct'
import {Template} from './template'
import {LocalStorage, Storable} from './local-storage'

export class StorageItemWidget implements ArrayWidget {
    @Storable() name: string
    @Storable() bool: boolean

    constructor(name: string, bool: boolean) {
        this.name = name
        this.bool = bool
    }
}

export class StorageTestWidget implements Widget {

    @LocalStorage(() => StorageItemWidget)
    items: StorageItemWidget[] = []

    @LocalStorage()
    strProperty: string

    @LocalStorage()
    boolProperty: string

    init = (el: Element) => 0

    @Template()
    markup() {
        return ''
    }
}

describe('Local Storage', () => {

    it('should store arrays', () => {
        const clock = Sinon.useFakeTimers()
        const div = document.createElement('div')
        const save = new StorageTestWidget()
        runConstructorQueue(save, div)
        save.items.push(new StorageItemWidget('A', true), new StorageItemWidget('B', false))
        clock.tick(100)
        const load = new StorageTestWidget()
        runConstructorQueue(load, div)

        expect(load.items.length).to.be.equal(2)
        expect(load.items[0].name).to.be.equal('A')
        expect(load.items[0].bool).to.be.equal(true)
        expect(load.items[1].name).to.be.equal('B')
        expect(load.items[1].bool).to.be.equal(false)
        clock.restore()
    })
})

