(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var construct_1 = require("../../src/typescript/decorators/construct");
var DocApp = /** @class */ (function () {
    function DocApp() {
    }
    DocApp.prototype.init = function (el) {
        console.log('Feather-Ts started');
    };
    DocApp = tslib_1.__decorate([
        construct_1.Construct({ selector: 'body', singleton: true })
    ], DocApp);
    return DocApp;
}());
exports.DocApp = DocApp;
construct_1.start();

},{"../../src/typescript/decorators/construct":4,"tslib":2}],2:[function(require,module,exports){
(function (global){
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if (typeof module === "object" && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

    __extends = function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [0, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function (m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    };

    __values = function (o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator];
        return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result["default"] = mod;
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var objects_1 = require("../utils/objects");
var dom_1 = require("../utils/dom");
var cleanUpQueue = new WeakMap();
exports.registerCleanUp = function (node, task) { return objects_1.ensure(cleanUpQueue, node, [task]); };
exports.cleanUp = function (node) { return setTimeout(function () {
    return dom_1.allChildNodes(node).forEach(function (node) {
        if (cleanUpQueue.has(node)) {
            cleanUpQueue.get(node).forEach(function (task) { return task(); });
            cleanUpQueue.delete(node);
        }
    });
}, 80); };

},{"../utils/dom":6,"../utils/objects":8}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("./router");
var cleanup_1 = require("../core/cleanup");
var strings_1 = require("../utils/strings");
var objects_1 = require("../utils/objects");
exports.ConstructRegistry = {};
exports.Singletons = {};
exports.start = function (root) {
    if (root === void 0) { root = document.documentElement; }
    var createdWidgets = [];
    Object.keys(exports.ConstructRegistry).forEach(function (selector) {
        Array.from(root.querySelectorAll(selector)).forEach(function (node) {
            var widget = new (Function.prototype.bind.apply(exports.ConstructRegistry[selector]));
            exports.runConstructorQueue(widget, node);
            createdWidgets.push(widget);
        });
    });
    if (root === document.documentElement) {
        router_1.runRoutes();
    }
    return createdWidgets;
};
exports.Construct = function (conf) { return function (proto) {
    exports.ConstructRegistry[conf.selector] = proto;
    exports.addToConstructorQueue(proto, function (widget, node) {
        if (conf.singleton === true) {
            var name_1 = strings_1.decapitalize(widget.constructor.name);
            exports.Singletons[name_1] = widget;
            cleanup_1.registerCleanUp(node, function () {
                delete exports.Singletons[name_1];
            });
        }
        widget.init(node);
    });
}; };
var queue = new WeakMap();
exports.addToConstructorQueue = function (constructor, func) {
    objects_1.ensure(queue, constructor, [func]);
};
exports.runConstructorQueue = function (widget, node) {
    var widgetQueue = queue.get(Object.getPrototypeOf(widget).constructor) || [];
    widgetQueue.forEach(function (m) { return m.call(widget, widget, node); });
};

},{"../core/cleanup":3,"../utils/objects":8,"../utils/strings":9,"./router":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var construct_1 = require("./construct");
var strings_1 = require("../utils/strings");
var cleanup_1 = require("../core/cleanup");
exports.routeListeners = {};
var namedRx = /[:*]\w+/gi;
var historyAPI = (window.history && window.history.pushState) && document.querySelector('[routing="hash"]') === null;
var rules = [
    [/:\w+/gi, '([\\w\\d-]+)'],
    [/\*\w+/gi, '(.+)']
];
// supports :param and *param and optional parts ()
var namedMatch = function (pattern, input) {
    var names = pattern.match(namedRx);
    if (names && names.length) {
        names = names.map(function (str) { return str.substr(1); });
        var repl = rules.reduce(function (p, c) { return p.replace(c[0], c[1]); }, pattern), finalR = new RegExp('^' + repl + '$', 'gi');
        return strings_1.namedRegexMatch(input, finalR, names);
    }
    else {
        if (new RegExp('^' + pattern + '$', 'gi').exec(input)) {
            return {};
        }
    }
};
var getCurrentRoute = function () {
    var path = location.pathname;
    if (!historyAPI) {
        if (path !== '/') {
            location.replace('/#' + path);
        }
        else {
            path = !location.hash ? '/' : location.hash.replace(/^#/, '');
        }
    }
    return path;
};
var notifyListeners = function (route) {
    Object.values(exports.routeListeners).forEach(function (handlers) {
        return handlers.forEach(function (rh) {
            var matchedParams = namedMatch(rh.route, route);
            if (matchedParams) {
                rh.callback(matchedParams);
            }
        });
    });
};
exports.navigate = function (path) {
    if (historyAPI) {
        history.pushState(null, '', path);
        notifyListeners(getCurrentRoute());
    }
    else {
        location.hash = path;
    }
};
exports.runRoutes = function () {
    if (!window['blockRouting']) {
        notifyListeners(getCurrentRoute());
    }
    window.addEventListener(historyAPI ? 'popstate' : 'hashchange', function () { return notifyListeners(getCurrentRoute()); }, false);
};
exports.Route = function (route) { return function (proto, method) {
    construct_1.addToConstructorQueue(proto.constructor, function (widget, node) {
        if (!exports.routeListeners[route]) {
            exports.routeListeners[route] = [];
        }
        var handler = { route: route, callback: widget[method].bind(widget) };
        exports.routeListeners[route].push(handler);
        cleanup_1.registerCleanUp(node, function () { return exports.routeListeners[route].splice(exports.routeListeners[route].indexOf(handler), 1); });
    });
}; };

},{"../core/cleanup":3,"../utils/strings":9,"./construct":4}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function allChildNodes(node) {
    var walker = document.createTreeWalker(node, NodeFilter.SHOW_ALL, null, false), nodes = [];
    var currentNode;
    do {
        currentNode = walker.currentNode;
        if (currentNode.nodeType !== Node.TEXT_NODE || currentNode.textContent.trim()) {
            nodes.push(currentNode);
        }
    } while (walker.nextNode());
    return nodes;
}
exports.allChildNodes = allChildNodes;
function allTextNodes(node) {
    var a = [], walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
    var n;
    while (n = walk.nextNode()) {
        a.push(n);
    }
    return a;
}
exports.allTextNodes = allTextNodes;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getType = {}.toString;
exports.compose = function (fns) { return function (res) {
    if (fns.length === 1) {
        return fns[0](res);
    }
    return fns.reduce(function (p, c) { return c(p); }, res);
}; };
exports.isFunction = function (functionToCheck) {
    return functionToCheck && getType.call(functionToCheck) === '[object Function]';
};
var lastCall = new WeakMap();
var throttles = new WeakMap();
exports.throttle = function (func, time) {
    var now = +new Date();
    var lastCallTime = (lastCall.get(func) || 0);
    if (now - time >= lastCallTime) {
        func();
        lastCall.set(func, now);
    }
    else {
        clearTimeout(throttles.get(func));
        throttles.set(func, setTimeout(function () {
            lastCall.set(func, now);
            func();
        }));
    }
};
exports.isDef = function (x) { return typeof x !== 'undefined'; };
exports.isUndef = function (x) { return !exports.isDef(x); };

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var functions_1 = require("./functions");
exports.pathCallbacks = new WeakMap();
exports.getSubset = function (keys, obj) {
    return keys.reduce(function (a, c) {
        return (tslib_1.__assign({}, a, (_a = {}, _a[c] = obj[c], _a)));
        var _a;
    }, {});
};
exports.isObject = function (obj) {
    return (obj !== null && typeof (obj) === 'object' && Object.prototype.toString.call(obj) === '[object Object]');
};
exports.deepValue = function (obj, path) {
    return path ? path.split('.').reduce(function (p, c) { return (p && functions_1.isDef(p[c])) ? p[c] : undefined; }, obj) : obj;
};
exports.merge = function (a, b) {
    if (a === void 0) { a = {}; }
    Object.keys(b).forEach(function (k) {
        var ak = a[k], bk = b[k];
        if (Array.isArray(ak)) {
            ak.push.apply(ak, bk);
        }
        else if (exports.isObject(ak)) {
            exports.merge(ak, bk);
        }
        else {
            a[k] = bk;
        }
    });
    return a;
};
exports.ensure = function (map, obj, defaultValue) {
    var lookup = map.get(obj);
    if (!lookup) {
        map.set(obj, lookup = defaultValue);
    }
    else if (Array.isArray(lookup) && Array.isArray(defaultValue)) {
        lookup.push.apply(lookup, defaultValue);
    }
    else if (exports.isObject(lookup)) {
        exports.merge(lookup, defaultValue);
    }
    return lookup;
};
exports.propertyCallbacks = new WeakMap();
exports.addPropertyListener = function (obj, property, callback) {
    var val = obj[property];
    var observed = exports.propertyCallbacks.has(obj) && exports.propertyCallbacks.get(obj)[property];
    exports.ensure(exports.propertyCallbacks, obj, (_a = {}, _a[property] = [callback], _a));
    if (!observed) {
        Object.defineProperty(obj, property, {
            get: function () { return val; },
            set: function (newVal) {
                val = newVal;
                exports.propertyCallbacks.get(obj)[property].forEach(function (c) { return c(property); });
                return val;
            }
        });
    }
    var _a;
};
exports.createObjectPropertyListener = function (obj, pathStr, callback) {
    var path = pathStr.split('.'), property = path.pop(), root = exports.deepValue(obj, path.join('.')), handler = function () {
        exports.pathCallbacks.get(obj)[pathStr].forEach(function (cb) { return cb(); });
    };
    exports.ensure(exports.pathCallbacks, obj, (_a = {}, _a[pathStr] = [callback], _a));
    exports.addPropertyListener(root, property, handler);
    var _a;
};

},{"./functions":7,"tslib":2}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var objects_1 = require("./objects");
function format(str, obj) {
    return str.replace(/{{.*?}}/g, function (m) {
        return objects_1.deepValue(obj, m.substring(2, m.length - 2));
    });
}
exports.format = format;
function namedRegexMatch(text, regex, matchNames) {
    var matches = regex.exec(text);
    if (!matches) {
        return;
    }
    return matches.reduce(function (result, match, index) {
        if (index > 0) {
            result[matchNames[index - 1]] = match;
        }
        return result;
    }, {});
}
exports.namedRegexMatch = namedRegexMatch;
exports.decapitalize = function (str) { return str.charAt(0).toLowerCase() + str.substr(1); };

},{"./objects":8}]},{},[1]);
