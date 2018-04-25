const jsdom = require('jsdom')
const Storage = require('node-storage-shim')
require('isomorphic-fetch')
const {JSDOM} = jsdom

let window = new JSDOM('<!doctype html><html><body></body></html>', {url: "https://example.org/"}).window
global.window = window
global.document = window.document
global.location = window.document.location
global.history = window.history
global.document.createRange = () => ({
  createContextualFragment: str => JSDOM.fragment(str)
})

global.window.localStorage = new Storage()
global.window.matchMedia = () => ({addListener: () => 0})

class MutationObserver {
    observe() {
    }
}

global.MutationObserver = MutationObserver
global.CustomEvent = window.CustomEvent
global.Node = window.Node
global.NodeFilter = window.NodeFilter
global.MouseEvent = window.MouseEvent
