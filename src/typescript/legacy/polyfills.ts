// include this file on startup to support ie11

import 'custom-event-polyfill/custom-event-polyfill'
import 'polyfill-array-includes/index'

if (!Array.from) {
    Array.from = (object) => {
        return [].slice.call(object)
    }
}

if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype['matchesSelector'] ||
        Element.prototype['mozMatchesSelector'] ||
        Element.prototype['msMatchesSelector'] ||
        Element.prototype['MatchesSelector'] ||
        Element.prototype['webkitMatchesSelector'] ||
        ((s) => {
            const matches = (this.document || this.ownerDocument).querySelectorAll(s)
            let i = matches.length
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1
        })
}

if (!Function.prototype.name) {
    Object.defineProperty(Function.prototype, 'name', {
        get: function () {
            const name = (this.toString().match(/^function\s*([^\s(]+)/) || [])[1]
            Object.defineProperty(this, 'name', { value: name })
            return name
        }
    })
}

if ('ab'.substr(-1) !== 'b') {
    String.prototype.substr = function(substr) {
        return function(start, length) {
            return substr.call(this,
                start < 0 ? this.length + start : start,
                length)
        }
    }(String.prototype.substr)
}

if (!String.prototype.startsWith) {
    const $toString = Object.prototype.toString
    const $indexOf = String.prototype.indexOf

    String.prototype.startsWith = function (search) {
        const string = String(this)
        if (this == null || $toString.call(search) === '[object RegExp]') {
            throw TypeError()
        }
        const stringLength = string.length
        const searchString = String(search)
        const position = arguments.length > 1 ? arguments[1] : undefined
        let pos = position ? Number(position) : 0
        if (isNaN(pos)) {
            pos = 0
        }
        const start = Math.min(Math.max(pos, 0), stringLength)
        return $indexOf.call(string, searchString, pos) === start
    }
}

