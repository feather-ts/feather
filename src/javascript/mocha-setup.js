const jsdom = require('jsdom')
const Storage = require('node-storage-shim')
require('isomorphic-fetch')
const matchMediaPolyfill = require('mq-polyfill').default
const {JSDOM} = jsdom

let window = new JSDOM('<!doctype html><html><body></body></html>', {url: "https://example.org/"}).window
matchMediaPolyfill(window)

const copy = ["document", "location", "history", "matchMedia", "MutationObserver",
    "CustomEvent", "Node", "NodeFilter", "MouseEvent", "DOMParser"]

global.window = window
copy.forEach(prop => global[prop] = window[prop])

global.document.createRange = () => ({
  createContextualFragment: str => JSDOM.fragment(str),
  selectNodeContents: () => 0
})

global.window.localStorage = new Storage()
global.window.matchMedia = window.matchMedia

const resizeEvent = document.createEvent('Event');
resizeEvent.initEvent('resize', true, true);

global.window.resizeTo = (width, height) => {
    global.window.innerWidth = width || global.window.innerWidth;
    global.window.innerHeight = height || global.window.innerHeight;
    global.window.dispatchEvent(resizeEvent);
};
