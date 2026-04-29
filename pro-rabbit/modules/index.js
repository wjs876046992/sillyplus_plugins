/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 213
(module) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 213;
module.exports = webpackEmptyContext;

/***/ },

/***/ 300
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.req = exports.json = exports.toBuffer = void 0;
const http = __importStar(__webpack_require__(611));
const https = __importStar(__webpack_require__(692));
async function toBuffer(stream) {
    let length = 0;
    const chunks = [];
    for await (const chunk of stream) {
        length += chunk.length;
        chunks.push(chunk);
    }
    return Buffer.concat(chunks, length);
}
exports.toBuffer = toBuffer;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function json(stream) {
    const buf = await toBuffer(stream);
    const str = buf.toString('utf8');
    try {
        return JSON.parse(str);
    }
    catch (_err) {
        const err = _err;
        err.message += ` (input: ${str})`;
        throw err;
    }
}
exports.json = json;
function req(url, opts = {}) {
    const href = typeof url === 'string' ? url : url.href;
    const req = (href.startsWith('https:') ? https : http).request(url, opts);
    const promise = new Promise((resolve, reject) => {
        req
            .once('response', resolve)
            .once('error', reject)
            .end();
    });
    req.then = promise.then.bind(promise);
    return req;
}
exports.req = req;
//# sourceMappingURL=helpers.js.map

/***/ },

/***/ 953
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Agent = void 0;
const net = __importStar(__webpack_require__(278));
const http = __importStar(__webpack_require__(611));
const https_1 = __webpack_require__(692);
__exportStar(__webpack_require__(300), exports);
const INTERNAL = Symbol('AgentBaseInternalState');
class Agent extends http.Agent {
    constructor(opts) {
        super(opts);
        this[INTERNAL] = {};
    }
    /**
     * Determine whether this is an `http` or `https` request.
     */
    isSecureEndpoint(options) {
        if (options) {
            // First check the `secureEndpoint` property explicitly, since this
            // means that a parent `Agent` is "passing through" to this instance.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (typeof options.secureEndpoint === 'boolean') {
                return options.secureEndpoint;
            }
            // If no explicit `secure` endpoint, check if `protocol` property is
            // set. This will usually be the case since using a full string URL
            // or `URL` instance should be the most common usage.
            if (typeof options.protocol === 'string') {
                return options.protocol === 'https:';
            }
        }
        // Finally, if no `protocol` property was set, then fall back to
        // checking the stack trace of the current call stack, and try to
        // detect the "https" module.
        const { stack } = new Error();
        if (typeof stack !== 'string')
            return false;
        return stack
            .split('\n')
            .some((l) => l.indexOf('(https.js:') !== -1 ||
            l.indexOf('node:https:') !== -1);
    }
    // In order to support async signatures in `connect()` and Node's native
    // connection pooling in `http.Agent`, the array of sockets for each origin
    // has to be updated synchronously. This is so the length of the array is
    // accurate when `addRequest()` is next called. We achieve this by creating a
    // fake socket and adding it to `sockets[origin]` and incrementing
    // `totalSocketCount`.
    incrementSockets(name) {
        // If `maxSockets` and `maxTotalSockets` are both Infinity then there is no
        // need to create a fake socket because Node.js native connection pooling
        // will never be invoked.
        if (this.maxSockets === Infinity && this.maxTotalSockets === Infinity) {
            return null;
        }
        // All instances of `sockets` are expected TypeScript errors. The
        // alternative is to add it as a private property of this class but that
        // will break TypeScript subclassing.
        if (!this.sockets[name]) {
            // @ts-expect-error `sockets` is readonly in `@types/node`
            this.sockets[name] = [];
        }
        const fakeSocket = new net.Socket({ writable: false });
        this.sockets[name].push(fakeSocket);
        // @ts-expect-error `totalSocketCount` isn't defined in `@types/node`
        this.totalSocketCount++;
        return fakeSocket;
    }
    decrementSockets(name, socket) {
        if (!this.sockets[name] || socket === null) {
            return;
        }
        const sockets = this.sockets[name];
        const index = sockets.indexOf(socket);
        if (index !== -1) {
            sockets.splice(index, 1);
            // @ts-expect-error  `totalSocketCount` isn't defined in `@types/node`
            this.totalSocketCount--;
            if (sockets.length === 0) {
                // @ts-expect-error `sockets` is readonly in `@types/node`
                delete this.sockets[name];
            }
        }
    }
    // In order to properly update the socket pool, we need to call `getName()` on
    // the core `https.Agent` if it is a secureEndpoint.
    getName(options) {
        const secureEndpoint = this.isSecureEndpoint(options);
        if (secureEndpoint) {
            // @ts-expect-error `getName()` isn't defined in `@types/node`
            return https_1.Agent.prototype.getName.call(this, options);
        }
        // @ts-expect-error `getName()` isn't defined in `@types/node`
        return super.getName(options);
    }
    createSocket(req, options, cb) {
        const connectOpts = {
            ...options,
            secureEndpoint: this.isSecureEndpoint(options),
        };
        const name = this.getName(connectOpts);
        const fakeSocket = this.incrementSockets(name);
        Promise.resolve()
            .then(() => this.connect(req, connectOpts))
            .then((socket) => {
            this.decrementSockets(name, fakeSocket);
            if (socket instanceof http.Agent) {
                try {
                    // @ts-expect-error `addRequest()` isn't defined in `@types/node`
                    return socket.addRequest(req, connectOpts);
                }
                catch (err) {
                    return cb(err);
                }
            }
            this[INTERNAL].currentSocket = socket;
            // @ts-expect-error `createSocket()` isn't defined in `@types/node`
            super.createSocket(req, options, cb);
        }, (err) => {
            this.decrementSockets(name, fakeSocket);
            cb(err);
        });
    }
    createConnection() {
        const socket = this[INTERNAL].currentSocket;
        this[INTERNAL].currentSocket = undefined;
        if (!socket) {
            throw new Error('No socket was returned in the `connect()` function');
        }
        return socket;
    }
    get defaultPort() {
        return (this[INTERNAL].defaultPort ??
            (this.protocol === 'https:' ? 443 : 80));
    }
    set defaultPort(v) {
        if (this[INTERNAL]) {
            this[INTERNAL].defaultPort = v;
        }
    }
    get protocol() {
        return (this[INTERNAL].protocol ??
            (this.isSecureEndpoint() ? 'https:' : 'http:'));
    }
    set protocol(v) {
        if (this[INTERNAL]) {
            this[INTERNAL].protocol = v;
        }
    }
}
exports.Agent = Agent;
//# sourceMappingURL=index.js.map

/***/ },

/***/ 120
(module) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
module.exports = /*#__PURE__*/function () {
  function MessageDeduplicator() {
    var _this = this;
    var ttlMs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5 * 60 * 1000;
    var cleanIntervalMs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 60 * 1000;
    _classCallCheck(this, MessageDeduplicator);
    this.ttl = ttlMs; // 消息保留时间
    this.store = new Map(); // 存储 msgId -> 过期时间

    // 确保只启动一个定时器
    if (!MessageDeduplicator._cleanerStarted) {
      MessageDeduplicator._cleanerStarted = true;
      setInterval(function () {
        return _this.cleanup();
      }, cleanIntervalMs).unref();
    }
  }
  return _createClass(MessageDeduplicator, [{
    key: "isFirstProcess",
    value: function isFirstProcess(msgId) {
      var now = Date.now();
      if (this.store.has(msgId)) {
        var expireAt = this.store.get(msgId);
        if (expireAt > now) {
          return false; // 已存在且未过期
        }
      }

      // 添加或更新过期时间
      this.store.set(msgId, now + this.ttl);
      return true;
    }
  }, {
    key: "cleanup",
    value: function cleanup() {
      var now = Date.now();
      var _iterator = _createForOfIteratorHelper(this.store.entries()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
            msgId = _step$value[0],
            expireAt = _step$value[1];
          if (expireAt <= now) {
            this.store["delete"](msgId);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }]);
}();

/***/ },

/***/ 939
(module, __unused_webpack_exports, __webpack_require__) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var axios = __webpack_require__(938);
var moment = __webpack_require__(716);
var _require = __webpack_require__(906),
  _requiredParam = _require._requiredParam;
var Proxy = /*#__PURE__*/function () {
  function Proxy() {
    var proxyUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _requiredParam('proxyUrl');
    _classCallCheck(this, Proxy);
    this.proxyUrl = this.getXqProxyUrl(proxyUrl);
    this.PROXY = null;
    this.EXPIRE_AT = null;
  }
  return _createClass(Proxy, [{
    key: "getXqProxyUrl",
    value: function getXqProxyUrl(proxyUrl) {
      if (!proxyUrl) {
        return null;
      }
      var url = new URL(proxyUrl);
      var params = url.searchParams;
      var act = params.get('act');
      if (!act.startsWith('getturn')) {
        return proxyUrl; // 非携趣代理，直接返回
      }
      var pools = [51, 82, 57, 61, 62];
      var randomPool = "getturn".concat(pools[Math.floor(Math.random() * pools.length)]);
      console.debug("\u4F7F\u7528\u643A\u8DA3\u4EE3\u7406\u96A7\u9053\u6C60: ".concat(randomPool));
      params.set('act', randomPool);
      url.search = params.toString();
      return url.toString();
    }
  }, {
    key: "getNewProxy",
    value: function () {
      var _getNewProxy = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var forceRefresh,
          _yield$axios$get,
          body,
          data,
          proxyList,
          proxy,
          userPassIpPortPattern,
          ipPortPattern,
          ip,
          _args = arguments,
          _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              forceRefresh = _args.length > 0 && _args[0] !== undefined ? _args[0] : false;
              if (!(this.PROXY && !forceRefresh && this.EXPIRE_AT && moment().isBefore(this.EXPIRE_AT))) {
                _context.n = 1;
                break;
              }
              console.debug("\u4F7F\u7528\u7F13\u5B58\u4EE3\u7406\uFF1A".concat(this.PROXY));
              return _context.a(2, this.PROXY);
            case 1:
              _context.n = 2;
              return axios.get(this.proxyUrl, {
                responseType: 'text'
              });
            case 2:
              _yield$axios$get = _context.v;
              body = _yield$axios$get.data;
              _context.p = 3;
              data = JSON.parse(body);
              if (!(data.code !== "200" || !data.data || data.data.length === 0)) {
                _context.n = 4;
                break;
              }
              console.error(body);
              // 未获取到代理
              return _context.a(2, null);
            case 4:
              proxyList = data.data;
              proxy = proxyList[0];
              this.PROXY = "http://".concat(proxy !== null && proxy !== void 0 && proxy.proxyWithPwd ? proxy === null || proxy === void 0 ? void 0 : proxy.proxyWithPwd : proxy === null || proxy === void 0 ? void 0 : proxy.proxy);
              this.EXPIRE_AT = moment().add(proxy.expireSeconds - 0, 's');
              console.debug('获取新的代理', this.PROXY, this.EXPIRE_AT.format("YYYY-MM-DD HH:mm:ss"));
              return _context.a(2, this.PROXY);
            case 5:
              _context.p = 5;
              _t = _context.v;
              if (!(_t.message.toLowerCase().indexOf('json') === -1)) {
                _context.n = 6;
                break;
              }
              console.error("\u4EE3\u7406\u83B7\u53D6\u5931\u8D25\uFF0C\u8FD4\u56DEnull");
              return _context.a(2, null);
            case 6:
              userPassIpPortPattern = /^[^:]+:[^:]+@(?:\d{1,3}\.){3}\d{1,3}:\d+$/;
              ipPortPattern = /^(?:\d{1,3}\.){3}\d{1,3}:\d+$/;
              if (body.indexOf('\r\n') > -1) {
                ip = body.split('\r\n')[0];
              } else if (body.indexOf('\r') > -1) {
                ip = body.split('\r')[0];
              } else if (body.indexOf('\n') > -1) {
                ip = body.split('\n')[0];
              } else if (body.indexOf('\t') > -1) {
                ip = body.split('\t')[0];
              } else {
                ip = body;
              }
              if (!(userPassIpPortPattern.test(ip) || ipPortPattern.test(ip))) {
                _context.n = 7;
                break;
              }
              this.PROXY = "http://".concat(ip);
              this.EXPIRE_AT = moment().add(60, 's'); // 拍脑袋1min
              console.info('获取新的代理', this.PROXY, this.EXPIRE_AT.format("YYYY-MM-DD HH:mm:ss"));
              return _context.a(2, this.PROXY);
            case 7:
              return _context.a(2);
          }
        }, _callee, this, [[3, 5]]);
      }));
      function getNewProxy() {
        return _getNewProxy.apply(this, arguments);
      }
      return getNewProxy;
    }()
  }]);
}();
module.exports = Proxy;

/***/ },

/***/ 122
(module) {

module.exports = {
  USER_AGENT: USER_AGENT
};
var USER_AGENTS = ["jdapp;android;12.6.1;;;M/5.0;appBuild/99149;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 12; SM-E5260 Build/V417IR; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/95.0.4638.74 Mobile Safari/537.36", "jdapp;android;13.6.3;;;M/5.0;appBuild/100141;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 12; 23078RKD5C Build/W528JS; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/95.0.4638.74 Mobile Safari/537.36", "jdapp;android;13.1.1;;;M/5.0;appBuild/169381;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 12; SM-E5260 Build/V417IR; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/95.0.4638.74 Mobile Safari/537.36"];
function USER_AGENT() {
  return USER_AGENTS[randomNumber(0, USER_AGENTS.length)];
}
function randomNumber() {
  var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
  return Math.min(Math.floor(min + Math.random() * (max - min)), max);
}

/***/ },

/***/ 567
(module, __unused_webpack_exports, __webpack_require__) {

module.exports = {
  ql: __webpack_require__(682),
  Proxy: __webpack_require__(939),
  USER_AGENT: (__webpack_require__(122).USER_AGENT),
  utils: __webpack_require__(906),
  MessageDeduplicator: __webpack_require__(120),
  matchByTitle: __webpack_require__(793)
};

/***/ },

/***/ 682
(module, __unused_webpack_exports, __webpack_require__) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var axios = __webpack_require__(938),
  moment = __webpack_require__(716);
var _require = __webpack_require__(498),
  console = _require.console;
var QingLong = /*#__PURE__*/function () {
  /**
   * 构造函数，生成token，并根据需要是否写库
   * @param {string} host 青龙地址
   * @param {string} client_id
   * @param {string} client_secret
   * @param {any} token 青龙token
   */
  function QingLong(host, client_id, client_secret, token) {
    _classCallCheck(this, QingLong);
    this.host = host;
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.token = token;
  }
  return _createClass(QingLong, [{
    key: "setAuthorization",
    value: function setAuthorization(authorization) {
      this.authorization = authorization;
    }
  }, {
    key: "checkToken",
    value: (
    /**
     * 检查token是否存在或者过期
     * @returns {Promise<object|null>} token对象
     */
    function () {
      var _checkToken = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var tokenInfo, _tokenInfo;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              tokenInfo = this.token || null;
              console.debug('checkToken1', JSON.stringify(tokenInfo));
              if (tokenInfo) {
                _context.n = 2;
                break;
              }
              _context.n = 1;
              return this.GetToken();
            case 1:
              tokenInfo = _context.v;
              _context.n = 4;
              break;
            case 2:
              tokenInfo = typeof tokenInfo === 'string' ? JSON.parse(tokenInfo) : tokenInfo;
              // 2. token 过期
              if (!(((_tokenInfo = tokenInfo) === null || _tokenInfo === void 0 ? void 0 : _tokenInfo.expiration) < moment().valueOf() / 1000)) {
                _context.n = 4;
                break;
              }
              _context.n = 3;
              return this.GetToken();
            case 3:
              tokenInfo = _context.v;
            case 4:
              console.debug('checkToken2', JSON.stringify(tokenInfo));
              return _context.a(2, tokenInfo);
          }
        }, _callee, this);
      }));
      function checkToken() {
        return _checkToken.apply(this, arguments);
      }
      return checkToken;
    }() // 修改青龙配置文件变量
    )
  }, {
    key: "ModifyConfig",
    value: function () {
      var _ModifyConfig = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(envs) {
        var Config, i, reg;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return this.GetConfig("config.sh");
            case 1:
              Config = _context2.v;
              if (!(Config != null)) {
                _context2.n = 3;
                break;
              }
              for (i = 0; i < envs.length; i++) {
                reg = new RegExp("(?<=export[ ]+" + envs[i].name + '[ ]*=[ ]*")[^"]*');
                if (Config.search(reg) === -1) Config += "\nexport " + envs[i].name + '="' + envs[i].value + '"';else Config = Config.replace(reg, envs[i].value);
              }
              _context2.n = 2;
              return this.UpdateConfig("config.sh", Config);
            case 2:
              return _context2.a(2, _context2.v);
            case 3:
              return _context2.a(2, false);
            case 4:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function ModifyConfig(_x) {
        return _ModifyConfig.apply(this, arguments);
      }
      return ModifyConfig;
    }() // 修改配置文件变量envs:[{name:变量名,value:变量值}]并执行含关键词keywords:[]的任务
  }, {
    key: "SpyTask",
    value: function () {
      var _SpyTask = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(envs, keywords) {
        var crons;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return this.ModifyConfig(envs);
            case 1:
              if (_context3.v) {
                _context3.n = 2;
                break;
              }
              return _context3.a(2, false);
            case 2:
              _context3.n = 3;
              return this.SearchCrons(keywords);
            case 3:
              crons = _context3.v;
              if (!(!crons || crons.length === 0)) {
                _context3.n = 4;
                break;
              }
              return _context3.a(2, false);
            case 4:
              _context3.n = 5;
              return this.StartCrons(crons[0].id || crons[0]._id);
            case 5:
              return _context3.a(2, _context3.v);
            case 6:
              return _context3.a(2);
          }
        }, _callee3, this);
      }));
      function SpyTask(_x2, _x3) {
        return _SpyTask.apply(this, arguments);
      }
      return SpyTask;
    }()
    /****************用户*******************/
    // 获取青龙token
  }, {
    key: "GetToken",
    value: (function () {
      var _GetToken = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        var resp, _t;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              _context4.p = 0;
              _context4.n = 1;
              return axios.get("".concat(this.host, "/open/auth/token?client_id=").concat(this.client_id, "&client_secret=").concat(this.client_secret), {
                headers: {
                  'Content-Type': 'application/json'
                },
                responseType: "json"
              });
            case 1:
              resp = _context4.v;
              console.debug('GetToken', JSON.stringify(resp === null || resp === void 0 ? void 0 : resp.data));
              return _context4.a(2, resp.data.data);
            case 2:
              _context4.p = 2;
              _t = _context4.v;
              console.error(_t);
              return _context4.a(2, null);
          }
        }, _callee4, this, [[0, 2]]);
      }));
      function GetToken() {
        return _GetToken.apply(this, arguments);
      }
      return GetToken;
    }())
  }, {
    key: "GetSubs",
    value: function () {
      var _GetSubs = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(searchValue) {
        var searchParams, resp, _t2;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              searchParams = {};
              if (searchValue) searchParams.searchValue = searchValue;
              _context5.n = 1;
              return axios.get("".concat(this.host, "/open/subscriptions"), {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                params: searchParams,
                responseType: "json"
              });
            case 1:
              resp = _context5.v;
              return _context5.a(2, resp.data.data);
            case 2:
              _context5.p = 2;
              _t2 = _context5.v;
              console.error(_t2);
              return _context5.a(2, null);
          }
        }, _callee5, this, [[0, 2]]);
      }));
      function GetSubs(_x4) {
        return _GetSubs.apply(this, arguments);
      }
      return GetSubs;
    }()
  }, {
    key: "StartSubs",
    value: function () {
      var _StartSubs = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(id) {
        var _resp$data, resp, _t3;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              _context6.p = 0;
              _context6.n = 1;
              return axios.put("".concat(this.host, "/open/subscriptions/run"), id, {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context6.v;
              return _context6.a(2, (resp === null || resp === void 0 || (_resp$data = resp.data) === null || _resp$data === void 0 ? void 0 : _resp$data.code) === 200);
            case 2:
              _context6.p = 2;
              _t3 = _context6.v;
              console.error(_t3);
              return _context6.a(2, false);
          }
        }, _callee6, this, [[0, 2]]);
      }));
      function StartSubs(_x5) {
        return _StartSubs.apply(this, arguments);
      }
      return StartSubs;
    }()
  }, {
    key: "GetEnvs",
    value: function () {
      var _GetEnvs = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(searchValue) {
        var searchParams, resp, _t4;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              _context7.p = 0;
              searchParams = {};
              if (searchValue) searchParams.searchValue = searchValue;
              _context7.n = 1;
              return axios.get("".concat(this.host, "/open/envs"), {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                params: searchParams,
                responseType: "json"
              });
            case 1:
              resp = _context7.v;
              return _context7.a(2, resp.data.data || []);
            case 2:
              _context7.p = 2;
              _t4 = _context7.v;
              console.error(_t4);
              return _context7.a(2, []);
          }
        }, _callee7, this, [[0, 2]]);
      }));
      function GetEnvs(_x6) {
        return _GetEnvs.apply(this, arguments);
      }
      return GetEnvs;
    }()
  }, {
    key: "GetEnv",
    value: function () {
      var _GetEnv = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(id) {
        var resp, _t5;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              _context8.p = 0;
              _context8.n = 1;
              return axios.get("".concat(this.host, "/open/envs/").concat(id), {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context8.v;
              return _context8.a(2, resp.data.data);
            case 2:
              _context8.p = 2;
              _t5 = _context8.v;
              console.error(_t5);
              return _context8.a(2, null);
          }
        }, _callee8, this, [[0, 2]]);
      }));
      function GetEnv(_x7) {
        return _GetEnv.apply(this, arguments);
      }
      return GetEnv;
    }()
  }, {
    key: "AddEnvs",
    value: function () {
      var _AddEnvs = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(envs) {
        var resp, _t6;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.p = _context9.n) {
            case 0:
              _context9.p = 0;
              _context9.n = 1;
              return axios.post("".concat(this.host, "/open/envs"), envs, {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context9.v;
              return _context9.a(2, resp.data.data);
            case 2:
              _context9.p = 2;
              _t6 = _context9.v;
              console.error(_t6);
              return _context9.a(2, null);
          }
        }, _callee9, this, [[0, 2]]);
      }));
      function AddEnvs(_x8) {
        return _AddEnvs.apply(this, arguments);
      }
      return AddEnvs;
    }()
  }, {
    key: "UpdateEnv",
    value: function () {
      var _UpdateEnv = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(id, name, value, remark) {
        var body, resp, _t7;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.p = _context0.n) {
            case 0:
              body = {
                value: value,
                name: name,
                remarks: remark
              };
              if (typeof id === "string") {
                body._id = id;
              } else {
                body.id = id;
              }
              _context0.p = 1;
              _context0.n = 2;
              return axios.put("".concat(this.host, "/open/envs"), body, {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 2:
              resp = _context0.v;
              return _context0.a(2, resp.data.data);
            case 3:
              _context0.p = 3;
              _t7 = _context0.v;
              console.error(_t7);
              return _context0.a(2, null);
          }
        }, _callee0, this, [[1, 3]]);
      }));
      function UpdateEnv(_x9, _x0, _x1, _x10) {
        return _UpdateEnv.apply(this, arguments);
      }
      return UpdateEnv;
    }()
  }, {
    key: "DeleteEnvs",
    value: function () {
      var _DeleteEnvs = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(id) {
        var resp, _t8;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.p = _context1.n) {
            case 0:
              _context1.p = 0;
              _context1.n = 1;
              return axios["delete"]("".concat(this.host, "/open/envs"), {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                data: id,
                responseType: "json"
              });
            case 1:
              resp = _context1.v;
              return _context1.a(2, resp.data.code === 200);
            case 2:
              _context1.p = 2;
              _t8 = _context1.v;
              console.error(_t8);
              return _context1.a(2, false);
          }
        }, _callee1, this, [[0, 2]]);
      }));
      function DeleteEnvs(_x11) {
        return _DeleteEnvs.apply(this, arguments);
      }
      return DeleteEnvs;
    }()
  }, {
    key: "MoveEnv",
    value: function () {
      var _MoveEnv = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(id, from, to) {
        var resp, _t9;
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.p = _context10.n) {
            case 0:
              _context10.p = 0;
              _context10.n = 1;
              return axios.put("".concat(this.host, "/open/envs/").concat(id, "/move"), {
                fromIndex: from,
                toIndex: to
              }, {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context10.v;
              return _context10.a(2, resp.data.data);
            case 2:
              _context10.p = 2;
              _t9 = _context10.v;
              console.error(_t9);
              return _context10.a(2, null);
          }
        }, _callee10, this, [[0, 2]]);
      }));
      function MoveEnv(_x12, _x13, _x14) {
        return _MoveEnv.apply(this, arguments);
      }
      return MoveEnv;
    }()
  }, {
    key: "DisableEnvs",
    value: function () {
      var _DisableEnvs = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(id) {
        var _resp$data2, resp, _t0;
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.p = _context11.n) {
            case 0:
              _context11.p = 0;
              _context11.n = 1;
              return axios.put("".concat(this.host, "/open/envs/disable"), id, {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context11.v;
              return _context11.a(2, (resp === null || resp === void 0 || (_resp$data2 = resp.data) === null || _resp$data2 === void 0 ? void 0 : _resp$data2.code) === 200);
            case 2:
              _context11.p = 2;
              _t0 = _context11.v;
              console.error(_t0);
              return _context11.a(2, false);
          }
        }, _callee11, this, [[0, 2]]);
      }));
      function DisableEnvs(_x15) {
        return _DisableEnvs.apply(this, arguments);
      }
      return DisableEnvs;
    }()
  }, {
    key: "EnableEnvs",
    value: function () {
      var _EnableEnvs = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(id) {
        var _resp$data3, resp, _t1;
        return _regenerator().w(function (_context12) {
          while (1) switch (_context12.p = _context12.n) {
            case 0:
              _context12.p = 0;
              _context12.n = 1;
              return axios.put("".concat(this.host, "/open/envs/enable"), id, {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context12.v;
              return _context12.a(2, (resp === null || resp === void 0 || (_resp$data3 = resp.data) === null || _resp$data3 === void 0 ? void 0 : _resp$data3.code) === 200);
            case 2:
              _context12.p = 2;
              _t1 = _context12.v;
              console.error(_t1);
              return _context12.a(2, false);
          }
        }, _callee12, this, [[0, 2]]);
      }));
      function EnableEnvs(_x16) {
        return _EnableEnvs.apply(this, arguments);
      }
      return EnableEnvs;
    }()
  }, {
    key: "GetConfigs",
    value: function () {
      var _GetConfigs = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
        var _resp$data4, resp, _t10;
        return _regenerator().w(function (_context13) {
          while (1) switch (_context13.p = _context13.n) {
            case 0:
              _context13.p = 0;
              _context13.n = 1;
              return axios.get("".concat(this.host, "/open/configs/files"), {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context13.v;
              return _context13.a(2, (_resp$data4 = resp.data) === null || _resp$data4 === void 0 ? void 0 : _resp$data4.data);
            case 2:
              _context13.p = 2;
              _t10 = _context13.v;
              console.error(_t10);
              return _context13.a(2, null);
          }
        }, _callee13, this, [[0, 2]]);
      }));
      function GetConfigs() {
        return _GetConfigs.apply(this, arguments);
      }
      return GetConfigs;
    }()
  }, {
    key: "GetConfig",
    value: function () {
      var _GetConfig = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(filename) {
        var _resp$data5, resp, _t11;
        return _regenerator().w(function (_context14) {
          while (1) switch (_context14.p = _context14.n) {
            case 0:
              _context14.p = 0;
              _context14.n = 1;
              return axios.get("".concat(this.host, "/open/configs/").concat(filename), {
                headers: {
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context14.v;
              return _context14.a(2, (_resp$data5 = resp.data) === null || _resp$data5 === void 0 ? void 0 : _resp$data5.data);
            case 2:
              _context14.p = 2;
              _t11 = _context14.v;
              console.error(_t11);
              return _context14.a(2, null);
          }
        }, _callee14, this, [[0, 2]]);
      }));
      function GetConfig(_x17) {
        return _GetConfig.apply(this, arguments);
      }
      return GetConfig;
    }()
  }, {
    key: "UpdateConfig",
    value: function () {
      var _UpdateConfig = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(filename, content) {
        var _resp$data6, resp, _t12;
        return _regenerator().w(function (_context15) {
          while (1) switch (_context15.p = _context15.n) {
            case 0:
              _context15.p = 0;
              _context15.n = 1;
              return axios.post("".concat(this.host, "/open/configs/save"), {
                name: filename,
                content: content
              }, {
                headers: {
                  "content-Type": "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context15.v;
              return _context15.a(2, ((_resp$data6 = resp.data) === null || _resp$data6 === void 0 ? void 0 : _resp$data6.code) === 200);
            case 2:
              _context15.p = 2;
              _t12 = _context15.v;
              console.error(_t12);
              return _context15.a(2, false);
          }
        }, _callee15, this, [[0, 2]]);
      }));
      function UpdateConfig(_x18, _x19) {
        return _UpdateConfig.apply(this, arguments);
      }
      return UpdateConfig;
    }()
  }, {
    key: "GetLogs",
    value: function () {
      var _GetLogs = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16() {
        var _resp$data7, resp, _t13;
        return _regenerator().w(function (_context16) {
          while (1) switch (_context16.p = _context16.n) {
            case 0:
              _context16.p = 0;
              _context16.n = 1;
              return axios.get("".concat(this.host, "/open/logs"), {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context16.v;
              return _context16.a(2, resp === null || resp === void 0 || (_resp$data7 = resp.data) === null || _resp$data7 === void 0 ? void 0 : _resp$data7.dirs);
            case 2:
              _context16.p = 2;
              _t13 = _context16.v;
              console.error(_t13);
              return _context16.a(2, null);
          }
        }, _callee16, this, [[0, 2]]);
      }));
      function GetLogs() {
        return _GetLogs.apply(this, arguments);
      }
      return GetLogs;
    }()
  }, {
    key: "GetLog",
    value: function () {
      var _GetLog = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(name, logfile) {
        var resp, _t14;
        return _regenerator().w(function (_context17) {
          while (1) switch (_context17.p = _context17.n) {
            case 0:
              _context17.p = 0;
              _context17.n = 1;
              return axios.get("".concat(this.host, "/open/logs/").concat(name, "/").concat(logfile), {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context17.v;
              return _context17.a(2, resp.data.data);
            case 2:
              _context17.p = 2;
              _t14 = _context17.v;
              console.error(_t14);
              return _context17.a(2, null);
          }
        }, _callee17, this, [[0, 2]]);
      }));
      function GetLog(_x20, _x21) {
        return _GetLog.apply(this, arguments);
      }
      return GetLog;
    }()
  }, {
    key: "GetCrons",
    value: function () {
      var _GetCrons = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(searchValue) {
        var searchParams, resp, _t15;
        return _regenerator().w(function (_context18) {
          while (1) switch (_context18.p = _context18.n) {
            case 0:
              _context18.p = 0;
              searchParams = {};
              if (searchValue) searchParams.searchValue = searchValue;
              _context18.n = 1;
              return axios.get("".concat(this.host, "/open/crons"), {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                params: searchParams,
                responseType: "json"
              });
            case 1:
              resp = _context18.v;
              return _context18.a(2, resp.data.data);
            case 2:
              _context18.p = 2;
              _t15 = _context18.v;
              console.error(_t15);
              return _context18.a(2, null);
          }
        }, _callee18, this, [[0, 2]]);
      }));
      function GetCrons(_x22) {
        return _GetCrons.apply(this, arguments);
      }
      return GetCrons;
    }()
  }, {
    key: "SearchCrons",
    value: function () {
      var _SearchCrons = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19(searchValue) {
        var resp, _t16;
        return _regenerator().w(function (_context19) {
          while (1) switch (_context19.p = _context19.n) {
            case 0:
              _context19.p = 0;
              _context19.n = 1;
              return axios.get("".concat(this.host, "\"/open/crons"), {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                params: {
                  searchValue: searchValue
                },
                responseType: "json"
              });
            case 1:
              resp = _context19.v;
              return _context19.a(2, resp.data.data);
            case 2:
              _context19.p = 2;
              _t16 = _context19.v;
              console.error(_t16);
              return _context19.a(2, null);
          }
        }, _callee19, this, [[0, 2]]);
      }));
      function SearchCrons(_x23) {
        return _SearchCrons.apply(this, arguments);
      }
      return SearchCrons;
    }()
  }, {
    key: "AddCron",
    value: function () {
      var _AddCron = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20(name, task, cron) {
        var resp, _t17;
        return _regenerator().w(function (_context20) {
          while (1) switch (_context20.p = _context20.n) {
            case 0:
              _context20.p = 0;
              _context20.n = 1;
              return axios.post("".concat(this.host, "/open/crons"), {
                command: task,
                schedule: cron,
                name: name
              }, {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context20.v;
              return _context20.a(2, resp.data.data);
            case 2:
              _context20.p = 2;
              _t17 = _context20.v;
              console.error(_t17);
              return _context20.a(2, null);
          }
        }, _callee20, this, [[0, 2]]);
      }));
      function AddCron(_x24, _x25, _x26) {
        return _AddCron.apply(this, arguments);
      }
      return AddCron;
    }()
  }, {
    key: "UpdateCron",
    value: function () {
      var _UpdateCron = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21(id, name, task, cron) {
        var body, resp, _t18;
        return _regenerator().w(function (_context21) {
          while (1) switch (_context21.p = _context21.n) {
            case 0:
              if (typeof id == "string") body = {
                command: task,
                name: name,
                schedule: cron,
                _id: id
              };else body = {
                command: task,
                name: name,
                schedule: cron,
                id: id
              };
              _context21.p = 1;
              _context21.n = 2;
              return axios.put("".concat(this.host, "/open/crons"), body, {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 2:
              resp = _context21.v;
              return _context21.a(2, resp.data.data);
            case 3:
              _context21.p = 3;
              _t18 = _context21.v;
              console.error(_t18);
              return _context21.a(2, null);
          }
        }, _callee21, this, [[1, 3]]);
      }));
      function UpdateCron(_x27, _x28, _x29, _x30) {
        return _UpdateCron.apply(this, arguments);
      }
      return UpdateCron;
    }()
  }, {
    key: "DeleteCrons",
    value: function () {
      var _DeleteCrons = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22(id) {
        var resp, _t19;
        return _regenerator().w(function (_context22) {
          while (1) switch (_context22.p = _context22.n) {
            case 0:
              _context22.p = 0;
              _context22.n = 1;
              return axios["delete"]("".concat(this.host, "/open/crons"), {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                data: id,
                responseType: "json"
              });
            case 1:
              resp = _context22.v;
              return _context22.a(2, resp.data.code === 200);
            case 2:
              _context22.p = 2;
              _t19 = _context22.v;
              console.error(_t19);
              return _context22.a(2, false);
          }
        }, _callee22, this, [[0, 2]]);
      }));
      function DeleteCrons(_x31) {
        return _DeleteCrons.apply(this, arguments);
      }
      return DeleteCrons;
    }()
  }, {
    key: "DisableCrons",
    value: function () {
      var _DisableCrons = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23(id) {
        var resp, _t20;
        return _regenerator().w(function (_context23) {
          while (1) switch (_context23.p = _context23.n) {
            case 0:
              _context23.p = 0;
              _context23.n = 1;
              return axios.put("".concat(this.host, "/open/crons/disable"), id, {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context23.v;
              return _context23.a(2, resp.data.code === 200);
            case 2:
              _context23.p = 2;
              _t20 = _context23.v;
              console.error(_t20);
              return _context23.a(2, false);
          }
        }, _callee23, this, [[0, 2]]);
      }));
      function DisableCrons(_x32) {
        return _DisableCrons.apply(this, arguments);
      }
      return DisableCrons;
    }()
  }, {
    key: "EnableCrons",
    value: function () {
      var _EnableCrons = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24(id) {
        var resp, _t21;
        return _regenerator().w(function (_context24) {
          while (1) switch (_context24.p = _context24.n) {
            case 0:
              _context24.p = 0;
              _context24.n = 1;
              return axios.put("".concat(this.host, "/open/crons/enable"), id, {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context24.v;
              return _context24.a(2, resp.data.code === 200);
            case 2:
              _context24.p = 2;
              _t21 = _context24.v;
              console.error(_t21);
              return _context24.a(2, false);
          }
        }, _callee24, this, [[0, 2]]);
      }));
      function EnableCrons(_x33) {
        return _EnableCrons.apply(this, arguments);
      }
      return EnableCrons;
    }()
  }, {
    key: "GetCronLog",
    value: function () {
      var _GetCronLog = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25(id) {
        var resp, _t22;
        return _regenerator().w(function (_context25) {
          while (1) switch (_context25.p = _context25.n) {
            case 0:
              _context25.p = 0;
              _context25.n = 1;
              return axios.get("".concat(this.host, "/open/crons/").concat(id, "/log"), {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context25.v;
              return _context25.a(2, resp.data.data);
            case 2:
              _context25.p = 2;
              _t22 = _context25.v;
              console.error(_t22);
              return _context25.a(2, null);
          }
        }, _callee25, this, [[0, 2]]);
      }));
      function GetCronLog(_x34) {
        return _GetCronLog.apply(this, arguments);
      }
      return GetCronLog;
    }()
  }, {
    key: "PinCrons",
    value: function () {
      var _PinCrons = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26(id) {
        var resp, _t23;
        return _regenerator().w(function (_context26) {
          while (1) switch (_context26.p = _context26.n) {
            case 0:
              _context26.p = 0;
              _context26.n = 1;
              return axios.put("".concat(this.host, "/open/crons/pin"), id, {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context26.v;
              return _context26.a(2, resp.data.code === 200);
            case 2:
              _context26.p = 2;
              _t23 = _context26.v;
              console.error(_t23);
              return _context26.a(2, false);
          }
        }, _callee26, this, [[0, 2]]);
      }));
      function PinCrons(_x35) {
        return _PinCrons.apply(this, arguments);
      }
      return PinCrons;
    }()
  }, {
    key: "UnpinCrons",
    value: function () {
      var _UnpinCrons = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27(id) {
        var resp, _t24;
        return _regenerator().w(function (_context27) {
          while (1) switch (_context27.p = _context27.n) {
            case 0:
              _context27.p = 0;
              _context27.n = 1;
              return axios.put("".concat(this.host, "/open/crons/unpin"), id, {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context27.v;
              return _context27.a(2, resp.data.code === 200);
            case 2:
              _context27.p = 2;
              _t24 = _context27.v;
              console.error(_t24);
              return _context27.a(2, false);
          }
        }, _callee27, this, [[0, 2]]);
      }));
      function UnpinCrons(_x36) {
        return _UnpinCrons.apply(this, arguments);
      }
      return UnpinCrons;
    }()
  }, {
    key: "StartCrons",
    value: function () {
      var _StartCrons = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee28(id) {
        var resp, _t25;
        return _regenerator().w(function (_context28) {
          while (1) switch (_context28.p = _context28.n) {
            case 0:
              _context28.p = 0;
              _context28.n = 1;
              return axios.put("".concat(this.host, "/open/crons/run"), id, {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context28.v;
              return _context28.a(2, resp.data.code === 200);
            case 2:
              _context28.p = 2;
              _t25 = _context28.v;
              console.error(_t25);
              return _context28.a(2, false);
          }
        }, _callee28, this, [[0, 2]]);
      }));
      function StartCrons(_x37) {
        return _StartCrons.apply(this, arguments);
      }
      return StartCrons;
    }()
  }, {
    key: "StopCrons",
    value: function () {
      var _StopCrons = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee29(id) {
        var resp, _t26;
        return _regenerator().w(function (_context29) {
          while (1) switch (_context29.p = _context29.n) {
            case 0:
              _context29.p = 0;
              _context29.n = 1;
              return axios.put("".concat(this.host, "/open/crons/stop"), id, {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context29.v;
              return _context29.a(2, resp.data.code === 200);
            case 2:
              _context29.p = 2;
              _t26 = _context29.v;
              console.error(_t26);
              return _context29.a(2, false);
          }
        }, _callee29, this, [[0, 2]]);
      }));
      function StopCrons(_x38) {
        return _StopCrons.apply(this, arguments);
      }
      return StopCrons;
    }()
  }, {
    key: "GetCronImport",
    value: function () {
      var _GetCronImport = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee30() {
        var resp, _t27;
        return _regenerator().w(function (_context30) {
          while (1) switch (_context30.p = _context30.n) {
            case 0:
              _context30.p = 0;
              _context30.n = 1;
              return axios.get("".concat(this.host, "/open/crons/import"), {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context30.v;
              return _context30.a(2, resp.data.data);
            case 2:
              _context30.p = 2;
              _t27 = _context30.v;
              console.error(_t27);
              return _context30.a(2, null);
          }
        }, _callee30, this, [[0, 2]]);
      }));
      function GetCronImport() {
        return _GetCronImport.apply(this, arguments);
      }
      return GetCronImport;
    }()
  }, {
    key: "GetScripts",
    value: function () {
      var _GetScripts = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee31() {
        var resp, _t28;
        return _regenerator().w(function (_context31) {
          while (1) switch (_context31.p = _context31.n) {
            case 0:
              _context31.p = 0;
              _context31.n = 1;
              return axios.get("".concat(this.host, "/open/scripts/files"), {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context31.v;
              return _context31.a(2, resp.data.data);
            case 2:
              _context31.p = 2;
              _t28 = _context31.v;
              console.error(_t28);
              return _context31.a(2, null);
          }
        }, _callee31, this, [[0, 2]]);
      }));
      function GetScripts() {
        return _GetScripts.apply(this, arguments);
      }
      return GetScripts;
    }()
  }, {
    key: "GetScript",
    value: function () {
      var _GetScript = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee32(filename, parent) {
        var resp, _t29;
        return _regenerator().w(function (_context32) {
          while (1) switch (_context32.p = _context32.n) {
            case 0:
              _context32.p = 0;
              _context32.n = 1;
              return axios.get("".concat(this.host, "/open/scripts/").concat(filename, "?path=").concat(parent), {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context32.v;
              return _context32.a(2, resp.data.data);
            case 2:
              _context32.p = 2;
              _t29 = _context32.v;
              console.error(_t29);
              return _context32.a(2, null);
          }
        }, _callee32, this, [[0, 2]]);
      }));
      function GetScript(_x39, _x40) {
        return _GetScript.apply(this, arguments);
      }
      return GetScript;
    }()
  }, {
    key: "AddScript",
    value: function () {
      var _AddScript = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee33(filename, path, content, originFilename) {
        var resp, _t30;
        return _regenerator().w(function (_context33) {
          while (1) switch (_context33.p = _context33.n) {
            case 0:
              _context33.p = 0;
              _context33.n = 1;
              return axios.post("".concat(this.host, "/open/scripts"), {
                filename: filename,
                path: path,
                content: content,
                originFilename: originFilename
              }, {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context33.v;
              return _context33.a(2, resp.data.code === 200);
            case 2:
              _context33.p = 2;
              _t30 = _context33.v;
              console.error(_t30);
              return _context33.a(2, false);
          }
        }, _callee33, this, [[0, 2]]);
      }));
      function AddScript(_x41, _x42, _x43, _x44) {
        return _AddScript.apply(this, arguments);
      }
      return AddScript;
    }()
  }, {
    key: "UpdateScript",
    value: function () {
      var _UpdateScript = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee34(filename, path, content) {
        var resp, _t31;
        return _regenerator().w(function (_context34) {
          while (1) switch (_context34.p = _context34.n) {
            case 0:
              _context34.p = 0;
              _context34.n = 1;
              return axios.post("".concat(this.host, "/open/scripts"), {
                path: path,
                filename: filename,
                content: content
              }, {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context34.v;
              return _context34.a(2, resp.data.code === 200);
            case 2:
              _context34.p = 2;
              _t31 = _context34.v;
              console.error(_t31);
              return _context34.a(2, false);
          }
        }, _callee34, this, [[0, 2]]);
      }));
      function UpdateScript(_x45, _x46, _x47) {
        return _UpdateScript.apply(this, arguments);
      }
      return UpdateScript;
    }()
  }, {
    key: "DeleteScript",
    value: function () {
      var _DeleteScript = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee35(filename, path) {
        var resp, _t32;
        return _regenerator().w(function (_context35) {
          while (1) switch (_context35.p = _context35.n) {
            case 0:
              _context35.p = 0;
              _context35.n = 1;
              return axios["delete"]("".concat(this.host, "/open/scripts"), {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                data: {
                  filename: filename,
                  path: path
                },
                responseType: "json"
              });
            case 1:
              resp = _context35.v;
              return _context35.a(2, resp.data.code === 200);
            case 2:
              _context35.p = 2;
              _t32 = _context35.v;
              console.error(_t32);
              return _context35.a(2, false);
          }
        }, _callee35, this, [[0, 2]]);
      }));
      function DeleteScript(_x48, _x49) {
        return _DeleteScript.apply(this, arguments);
      }
      return DeleteScript;
    }() // 执行脚本
  }, {
    key: "TaskScript",
    value: function () {
      var _TaskScript = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee36(filename, path) {
        var resp, _t33;
        return _regenerator().w(function (_context36) {
          while (1) switch (_context36.p = _context36.n) {
            case 0:
              _context36.p = 0;
              _context36.n = 1;
              return axios.put("".concat(this.host, "/open/scripts/run"), {
                filename: filename,
                path: path
              }, {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context36.v;
              return _context36.a(2, resp.data.code === 200);
            case 2:
              _context36.p = 2;
              _t33 = _context36.v;
              console.error(_t33);
              return _context36.a(2, false);
          }
        }, _callee36, this, [[0, 2]]);
      }));
      function TaskScript(_x50, _x51) {
        return _TaskScript.apply(this, arguments);
      }
      return TaskScript;
    }()
  }, {
    key: "StopScript",
    value: function () {
      var _StopScript = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee37(filename, path) {
        var resp, _t34;
        return _regenerator().w(function (_context37) {
          while (1) switch (_context37.p = _context37.n) {
            case 0:
              _context37.p = 0;
              _context37.n = 1;
              return axios.put("".concat(this.host, "/open/scripts/stop"), {
                filename: filename,
                path: path
              }, {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context37.v;
              return _context37.a(2, resp.data.code === 200);
            case 2:
              _context37.p = 2;
              _t34 = _context37.v;
              console.error(_t34);
              return _context37.a(2, false);
          }
        }, _callee37, this, [[0, 2]]);
      }));
      function StopScript(_x52, _x53) {
        return _StopScript.apply(this, arguments);
      }
      return StopScript;
    }()
  }, {
    key: "GetVersion",
    value: function () {
      var _GetVersion = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee38() {
        var resp, _t35;
        return _regenerator().w(function (_context38) {
          while (1) switch (_context38.p = _context38.n) {
            case 0:
              _context38.p = 0;
              _context38.n = 1;
              return axios.get("".concat(this.host, "/open/system"), {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context38.v;
              return _context38.a(2, resp.data.data);
            case 2:
              _context38.p = 2;
              _t35 = _context38.v;
              console.error(_t35);
              return _context38.a(2, null);
          }
        }, _callee38, this, [[0, 2]]);
      }));
      function GetVersion() {
        return _GetVersion.apply(this, arguments);
      }
      return GetVersion;
    }() // 获取青龙日志删除频率,未知错误，获取失败
  }, {
    key: "GetSeqLogClear",
    value: function () {
      var _GetSeqLogClear = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee39() {
        var resp, _t36;
        return _regenerator().w(function (_context39) {
          while (1) switch (_context39.p = _context39.n) {
            case 0:
              _context39.p = 0;
              _context39.n = 1;
              return axios.get("".concat(this.host, "/open/system/log/clear"), {
                headers: {
                  accept: "application/json",
                  Authorization: this.authorization
                },
                responseType: "json"
              });
            case 1:
              resp = _context39.v;
              return _context39.a(2, resp.data.data);
            case 2:
              _context39.p = 2;
              _t36 = _context39.v;
              console.error(_t36);
              return _context39.a(2, null);
          }
        }, _callee39, this, [[0, 2]]);
      }));
      function GetSeqLogClear() {
        return _GetSeqLogClear.apply(this, arguments);
      }
      return GetSeqLogClear;
    }()
  }], [{
    key: "create",
    value: function () {
      var _create = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee40(host, client_id, client_secret, token) {
        var _ql$token, _ql$token2;
        var ql, authorization;
        return _regenerator().w(function (_context40) {
          while (1) switch (_context40.n) {
            case 0:
              ql = new QingLong(host, client_id, client_secret, token);
              console.debug("create QingLong host:".concat(host, " client_id:").concat(client_id, " client_secret:").concat(client_secret, " token:").concat(token));
              _context40.n = 1;
              return ql.checkToken();
            case 1:
              token = _context40.v;
              if (!(!token || !token.token || !token.token_type)) {
                _context40.n = 2;
                break;
              }
              throw new Error('token获取失败');
            case 2:
              ql.token = token;
              authorization = "".concat(ql === null || ql === void 0 || (_ql$token = ql.token) === null || _ql$token === void 0 ? void 0 : _ql$token.token_type, " ").concat(ql === null || ql === void 0 || (_ql$token2 = ql.token) === null || _ql$token2 === void 0 ? void 0 : _ql$token2.token);
              ql.setAuthorization(authorization);
              return _context40.a(2, ql);
          }
        }, _callee40);
      }));
      function create(_x54, _x55, _x56, _x57) {
        return _create.apply(this, arguments);
      }
      return create;
    }()
  }]);
}();
module.exports = QingLong;

/***/ },

/***/ 793
(module) {

"use strict";
// title-match-mongoose.js
// 变更点：matchByTitle 最终返回“完整 doc”（而不是只投影 title 字段）
// 做法：
// 1) 第一/第二阶段召回时仍然只查少量字段（默认 _id + titleField），用于打分，减少IO
// 2) 最终选出 best 后，再用 _id 做一次 findById / findOne 把整条记录取出来返回
//
// 这样既满足“返回完整 doc”，又尽量避免一次性把候选集的所有字段都查出来。



function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function toHalfWidth(s) {
  var out = '';
  var _iterator = _createForOfIteratorHelper(s),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var ch = _step.value;
      var code = ch.charCodeAt(0);
      if (code >= 0xff01 && code <= 0xff5e) out += String.fromCharCode(code - 0xfee0);else if (code === 0x3000) out += ' ';else out += ch;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return out;
}
function normalizeTitle(raw) {
  if (!raw) return '';
  var s = String(raw).trim();

  // 去掉开头连续“标签块”（【...】 / [...] / (...)）
  while (/^(\s*(【[^】]{1,20}】|\[[^\]]{1,20}\]|\([^)]{1,20}\)))+/.test(s)) {
    s = s.replace(/^(\s*(【[^】]{1,20}】|\[[^\]]{1,20}\]|\([^)]{1,20}\)))+/, '').trim();
  }
  s = toHalfWidth(s).toLowerCase();
  s = s.replace(/[，,。.;；:：/\\|_~`'"“”‘’！？!?\-—·•]+/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}
function extractAnchors(norm) {
  var anchors = new Set();
  var nums = norm.match(/\b\d{2,6}\b/g);
  if (nums) nums.forEach(function (x) {
    return anchors.add(x);
  });
  var alnum = norm.match(/\b[a-z0-9]{3,}\b/g);
  if (alnum) alnum.forEach(function (x) {
    return anchors.add(x);
  });
  return _toConsumableArray(anchors);
}
function buildQueryChunks(norm) {
  if (!norm) return {
    mode: 'empty',
    chunks: []
  };
  if (norm.length < 18) return {
    mode: 'short',
    chunks: [norm]
  };
  var L = Math.max(12, Math.min(30, Math.floor(norm.length * 0.6)));
  var prefix = norm.slice(0, L);
  var suffix = norm.slice(-L);
  var midStart = Math.max(0, Math.floor((norm.length - L) / 2));
  var middle = norm.slice(midStart, midStart + L);
  var anchors = extractAnchors(norm).slice(0, 3);
  var anchorChunk = anchors.length ? anchors.join(' ') : null;
  var chunks = [prefix, suffix, middle, anchorChunk].filter(Boolean);
  var uniq = [];
  var seen = new Set();
  var _iterator2 = _createForOfIteratorHelper(chunks),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var c = _step2.value;
      var k = c.trim();
      if (!k || seen.has(k)) continue;
      seen.add(k);
      uniq.push(k);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return {
    mode: 'normal',
    chunks: uniq
  };
}
function scoreCandidate(norm2, title1) {
  var n1 = normalizeTitle(title1);

  // 最强：包含关系
  if (norm2 && n1 && (norm2.includes(n1) || n1.includes(norm2))) return 1000;
  var score = 0;

  // 锚点一致性
  var a2 = new Set(extractAnchors(norm2));
  var a1 = new Set(extractAnchors(n1));
  var anchorInter = 0;
  var _iterator3 = _createForOfIteratorHelper(a2),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var x = _step3.value;
      if (a1.has(x)) anchorInter++;
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  score += Math.min(anchorInter, 5) * 60;

  // token 重合
  var tokens = function tokens(str) {
    return String(str).split(/\s+/).filter(Boolean).filter(function (x) {
      return x.length >= 2;
    });
  };
  var t2 = new Set(tokens(norm2));
  var t1 = new Set(tokens(n1));
  var inter = 0;
  var _iterator4 = _createForOfIteratorHelper(t2),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var _x = _step4.value;
      if (t1.has(_x)) inter++;
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  var denom = Math.max(1, Math.min(t2.size, t1.size));
  score += Math.floor(inter / denom * 100);
  return score;
}

/**
 * 用 title2 匹配 sku_name，最终返回“完整 doc”
 *
 * @param {import('mongoose').Model} Model - Mongoose Model
 * @param {object} baseQuery - 已有索引字段过滤条件（先缩小范围）
 * @param {string} title2 - 待匹配标题
 * @param {object} options
 * @param {string} [options.titleField='sku_name'] - title1 字段名
 * @param {number} [options.limit=200] - 候选上限
 * @param {number} [options.minScore=260] - 命中阈值
 * @param {object|null} [options.fullProjection=null] - 返回完整 doc 时的投影；null 表示不限制字段（整条返回）
 *
 * @returns {Promise<{doc:any|null, score:number, candidatesCount:number, strategy:string}>}
 */
function matchByTitle(_x2, _x3, _x4) {
  return _matchByTitle.apply(this, arguments);
}
function _matchByTitle() {
  _matchByTitle = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(Model, baseQuery, title2) {
    var _options$limit, _options$minScore;
    var options,
      titleField,
      limit,
      minScore,
      fullProjection,
      norm2,
      recallProjection,
      fullRegex,
      candidates,
      strategy,
      pack,
      orConds,
      best,
      bestScore,
      _iterator5,
      _step5,
      doc,
      s,
      fullDoc,
      _args = arguments;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          options = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};
          if (!(!Model || typeof Model.find !== 'function')) {
            _context.n = 1;
            break;
          }
          throw new Error('matchByTitle 第一个参数必须是 Mongoose Model（Schema 不能查询）');
        case 1:
          titleField = options.titleField || 'sku_name';
          limit = (_options$limit = options.limit) !== null && _options$limit !== void 0 ? _options$limit : 200;
          minScore = (_options$minScore = options.minScore) !== null && _options$minScore !== void 0 ? _options$minScore : 260;
          fullProjection = Object.prototype.hasOwnProperty.call(options, 'fullProjection') ? options.fullProjection : null;
          norm2 = normalizeTitle(title2);
          if (norm2) {
            _context.n = 2;
            break;
          }
          return _context.a(2, {
            doc: null,
            score: -1,
            candidatesCount: 0,
            strategy: 'title2为空'
          });
        case 2:
          // 召回阶段：只取 _id + titleField 用于打分，减少 IO
          recallProjection = _defineProperty({
            _id: 1
          }, titleField, 1); // 阶段1：整句（归一化后）包含匹配
          fullRegex = new RegExp(escapeRegex(norm2), 'i');
          _context.n = 3;
          return Model.find({
            $and: [baseQuery, _defineProperty({}, titleField, fullRegex)]
          }, recallProjection).limit(limit).lean().exec();
        case 3:
          candidates = _context.v;
          strategy = '整句(归一化)包含匹配'; // 阶段2：分段 OR 召回
          if (!(candidates.length === 0)) {
            _context.n = 5;
            break;
          }
          pack = buildQueryChunks(norm2);
          orConds = pack.chunks.map(function (c) {
            return _defineProperty({}, titleField, new RegExp(escapeRegex(c), 'i'));
          });
          _context.n = 4;
          return Model.find({
            $and: [baseQuery, {
              $or: orConds
            }]
          }, recallProjection).limit(limit).lean().exec();
        case 4:
          candidates = _context.v;
          strategy = "\u5206\u6BB5OR\u53EC\u56DE(mode=".concat(pack.mode, ", chunks=").concat(pack.chunks.length, ")");
        case 5:
          // 应用侧精排/确认：选出 best _id
          best = null;
          bestScore = -1;
          _iterator5 = _createForOfIteratorHelper(candidates);
          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              doc = _step5.value;
              s = scoreCandidate(norm2, doc[titleField]);
              if (s > bestScore) {
                bestScore = s;
                best = doc;
              }
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
          if (!(!best || bestScore < minScore)) {
            _context.n = 6;
            break;
          }
          return _context.a(2, {
            doc: null,
            score: bestScore,
            candidatesCount: candidates.length,
            strategy: strategy
          });
        case 6:
          _context.n = 7;
          return Model.findById(best._id, fullProjection).lean().exec();
        case 7:
          fullDoc = _context.v;
          return _context.a(2, {
            doc: fullDoc,
            score: bestScore,
            candidatesCount: candidates.length,
            strategy: strategy
          });
      }
    }, _callee);
  }));
  return _matchByTitle.apply(this, arguments);
}
module.exports = matchByTitle;

/***/ },

/***/ 906
(module, __unused_webpack_exports, __webpack_require__) {

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var _require = __webpack_require__(498),
  Bucket = _require.Bucket,
  Adapter = _require.Adapter,
  s = _require.sender,
  console = _require.console;
var QingLong = __webpack_require__(682);
var _require2 = __webpack_require__(396),
  HttpsProxyAgent = _require2.HttpsProxyAgent;

/**
 * 工具函数，用于抛出错误
 * @param {string} paramName
 */
var _requiredParam = function _requiredParam(paramName) {
  throw new Error("\u53C2\u6570 ".concat(paramName, " \u662F\u5FC5\u586B\u7684"));
};
var isPlainObject = function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
};
var _format = function _format(log) {
  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var arr = [];
  var _iterator = _createForOfIteratorHelper(args),
    _step;
  try {
    var _loop = function _loop() {
      var arg = _step.value;
      if (arg === null || arg === undefined) {
        arr.push(arg);
        return 1; // continue
      }
      if (_typeof(arg) === 'object') {
        if (Array.isArray(arg)) {
          arr.push(JSON.stringify(arg));
        } else if (isPlainObject(arg)) {
          var sortedObj = Object.keys(arg).sort().reduce(function (acc, key) {
            acc[key] = arg[key];
            return acc;
          }, {});
          arr.push(JSON.stringify(sortedObj));
        } else {
          // 非数组非普通对象，例如 Date、Error、Map 等，原样处理
          arr.push(arg);
        }
      } else {
        arr.push(arg);
      }
    };
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      if (_loop()) continue;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  log.apply(void 0, arr);
};
var logger = {
  debug: function debug() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _format(console.debug, args);
  },
  log: function log() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    _format(console.log, args);
  },
  info: function info() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    _format(console.log, args);
  },
  warn: function warn() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    _format(console.error, args);
  },
  error: function error() {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }
    _format(console.error, args);
  }
};

/**
 * 从cookie字符串中提取有效信息，支持以下三种场景：
 * 1. pin + wskey 场景，返回 {wskey, pin}
 * 2. pt_pin + pt_key 场景，返回 {pt_key, pt_pin}
 * 3. pin + light_key 场景，返回 {light_key, pin}
 * 优先级别：pt_key > wskey > light_key，如果都没有匹配到，则返回null
 * @param cookie
 * @returns {{light_key: *, pin: string}|{wskey: *, pin: string}|{pt_key: *, pt_pin: string}|null}
 * @private
 */
var _extractCookie = function _extractCookie(cookie) {
  if (!cookie) {
    return null;
  }
  // 先将 cookie 字符串分割成键值对数组
  var parts = cookie.split(";").map(function (kv) {
    return kv.trim();
  });

  // 构造对象，方便读取
  var cookieObj = {};
  var _iterator2 = _createForOfIteratorHelper(parts),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var part = _step2.value;
      var idx = part.indexOf("=");
      if (idx > 0) {
        var key = part.slice(0, idx).trim();
        var value = part.slice(idx + 1).trim();
        cookieObj[key] = value;
      }
    }
    // 优先处理 pt_key 场景 pt_pin + pt_key 场景
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  if (cookieObj.pt_pin && cookieObj.pt_key) {
    return {
      pt_key: cookieObj.pt_key,
      pt_pin: encodeURIComponent(decodeURIComponent(cookieObj.pt_pin))
    };
  }
  // 判断是否存在 pin 和 wskey
  if (cookieObj.pin && cookieObj.wskey) {
    return {
      wskey: cookieObj.wskey,
      pin: encodeURIComponent(decodeURIComponent(cookieObj.pin))
    };
  }
  // 检查 pin + light_key 场景
  if (cookieObj.pin && cookieObj.light_key) {
    return {
      light_key: cookieObj.light_key,
      pin: encodeURIComponent(decodeURIComponent(cookieObj.pin))
    };
  }
};

/**
 * 从cookie字符串中提取pin值，支持上述三种场景，优先级别：pt_key > wskey > light_key，如果都没有匹配到，则返回null
 * @param cookie
 * @returns {string|*|null}
 */
var extractPin = function extractPin(cookie) {
  var ck = _extractCookie(cookie);
  return (ck === null || ck === void 0 ? void 0 : ck.pt_pin) || (ck === null || ck === void 0 ? void 0 : ck.pin) || null;
};

/**
 * 从cookie字符串中提取有效信息，并平铺成字符串返回，支持上述三种场景，优先级别：pt_key > wskey > light_key，如果都没有匹配到，则返回null
 * @param cookie
 * @returns {string|null}
 */
var extractCookie = function extractCookie(cookie) {
  var result = _extractCookie(cookie);
  if (!result) {
    logger.warn("\u65E0\u6CD5\u4ECEcookie\u4E2D\u63D0\u53D6\u6709\u6548\u4FE1\u606F\uFF0Ccookie: ".concat(cookie));
    return null;
  }

  // 平铺成字符串
  return Object.keys(result).map(function (key) {
    return "".concat(key, "=").concat(result[key], ";");
  }).join("; ");
};
var getUserInfoByPin = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(pin, platform) {
    var pinDB, _iterator3, _step3, key, v, i, e, _t, _t2, _t3;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          if (pin) {
            _context.n = 1;
            break;
          }
          return _context.a(2);
        case 1:
          pin = encodeURIComponent(decodeURIComponent(pin));
          pinDB = new Bucket('pinDB');
          _t = _createForOfIteratorHelper;
          _context.n = 2;
          return pinDB.keys();
        case 2:
          _iterator3 = _t(_context.v);
          _context.p = 3;
          _iterator3.s();
        case 4:
          if ((_step3 = _iterator3.n()).done) {
            _context.n = 13;
            break;
          }
          key = _step3.value;
          _context.n = 5;
          return pinDB.get(key);
        case 5:
          v = _context.v;
          if (!(typeof v === 'string')) {
            _context.n = 8;
            break;
          }
          _context.p = 6;
          v = JSON.parse(v);
          _context.n = 8;
          break;
        case 7:
          _context.p = 7;
          _t2 = _context.v;
          logger.debug("parse error. ".concat(v));
          throw _t2;
        case 8:
          if (!(!v.Pin || platform && v.Form !== platform)) {
            _context.n = 9;
            break;
          }
          return _context.a(3, 12);
        case 9:
          i = 0;
        case 10:
          if (!(i < v.Pin.length)) {
            _context.n = 12;
            break;
          }
          e = v.Pin[i];
          if (!(pin.indexOf(e) > -1 || pin.indexOf(decodeURIComponent(e)) > -1)) {
            _context.n = 11;
            break;
          }
          return _context.a(2, v);
        case 11:
          i++;
          _context.n = 10;
          break;
        case 12:
          _context.n = 4;
          break;
        case 13:
          _context.n = 15;
          break;
        case 14:
          _context.p = 14;
          _t3 = _context.v;
          _iterator3.e(_t3);
        case 15:
          _context.p = 15;
          _iterator3.f();
          return _context.f(15);
        case 16:
          return _context.a(2);
      }
    }, _callee, null, [[6, 7], [3, 14, 15, 16]]);
  }));
  return function getUserInfoByPin(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * 根据平台获取所有用户信息
 * @param platform
 * @returns {Promise<*[]>}
 */
var getUsersByPlatform = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(platform) {
    var pinDB, users, _iterator4, _step4, key, v, _t4, _t5, _t6;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          pinDB = new Bucket('pinDB');
          users = [];
          _t4 = _createForOfIteratorHelper;
          _context2.n = 1;
          return pinDB.keys();
        case 1:
          _iterator4 = _t4(_context2.v);
          _context2.p = 2;
          _iterator4.s();
        case 3:
          if ((_step4 = _iterator4.n()).done) {
            _context2.n = 10;
            break;
          }
          key = _step4.value;
          _context2.n = 4;
          return pinDB.get(key);
        case 4:
          v = _context2.v;
          if (!(typeof v === 'string')) {
            _context2.n = 7;
            break;
          }
          _context2.p = 5;
          v = JSON.parse(v);
          _context2.n = 7;
          break;
        case 6:
          _context2.p = 6;
          _t5 = _context2.v;
          logger.debug("parse error. ".concat(v));
          throw _t5;
        case 7:
          if (!(!v.Pin || platform && v.Form !== platform)) {
            _context2.n = 8;
            break;
          }
          return _context2.a(3, 9);
        case 8:
          users.push(v);
        case 9:
          _context2.n = 3;
          break;
        case 10:
          _context2.n = 12;
          break;
        case 11:
          _context2.p = 11;
          _t6 = _context2.v;
          _iterator4.e(_t6);
        case 12:
          _context2.p = 12;
          _iterator4.f();
          return _context2.f(12);
        case 13:
          return _context2.a(2, users);
      }
    }, _callee2, null, [[5, 6], [2, 11, 12, 13]]);
  }));
  return function getUsersByPlatform(_x3) {
    return _ref2.apply(this, arguments);
  };
}();
var getUser = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var pinDB, platform, userId, key, value;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          pinDB = new Bucket('pinDB');
          _context3.n = 1;
          return s.getPlatform();
        case 1:
          platform = _context3.v;
          _context3.n = 2;
          return s.getUserId();
        case 2:
          userId = _context3.v;
          key = "".concat(platform, ":").concat(userId); // logger.debug(key)
          _context3.n = 3;
          return pinDB.get(key);
        case 3:
          value = _context3.v;
          if (value) {
            _context3.n = 4;
            break;
          }
          return _context3.a(2, false);
        case 4:
          if (!(typeof value === 'string')) {
            _context3.n = 5;
            break;
          }
          return _context3.a(2, JSON.parse(value));
        case 5:
          return _context3.a(2, value);
      }
    }, _callee3);
  }));
  return function getUser() {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * 用户多账号时，选择账号
 * @param pinIndex 用户输入的pinIndex，可以是数字（表示序号）或者pin值的一部分
 * @returns {Promise<*>}
 */
var chooseJdUserPin = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var pinIndex,
      user,
      pin,
      found,
      msg,
      i,
      element,
      content,
      _args4 = arguments;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          pinIndex = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : undefined;
          _context4.n = 1;
          return getUser();
        case 1:
          user = _context4.v;
          if (!(!user || !user.Pin || user.Pin.length === 0)) {
            _context4.n = 2;
            break;
          }
          _context4.n = 6;
          break;
        case 2:
          if (!(user.Pin.length === 1)) {
            _context4.n = 3;
            break;
          }
          pin = user.Pin[0];
          _context4.n = 6;
          break;
        case 3:
          if (!pinIndex) {
            _context4.n = 4;
            break;
          }
          if (/^-?\d+(\.\d+)?$/.test(pinIndex)) {
            // 是数字，可能传的直接是index
            pin = user.Pin[pinIndex - 1];
          } else {
            // 传递的是pin值，进行模糊匹配
            found = user.Pin.filter(function (p) {
              return p.indexOf(pinIndex) > -1 || decodeURIComponent(p).indexOf(pinIndex) > -1;
            });
            pin = found.length > 0 ? found[0] : null;
          }
          _context4.n = 6;
          break;
        case 4:
          msg = '';
          for (i = 0; i < user.Pin.length; i++) {
            element = user.Pin[i];
            msg += "".concat(i + 1, ": ").concat(element, "\n");
          }
          _context4.n = 5;
          return wait4Input(msg + '\n请输入序号：', /^\d$/, {
            delMsg: true
          });
        case 5:
          content = _context4.v;
          pin = user.Pin[content - 1];
        case 6:
          return _context4.a(2, pin);
      }
    }, _callee4);
  }));
  return function chooseJdUserPin() {
    return _ref4.apply(this, arguments);
  };
}();

/**
 * 根据ql客户端和pin查找对应的cookie，优先使用pin进行模糊匹配，如果pin是数字则直接按照index查找
 * @param ql ql客户端
 * @param pin pin值或者index
 * @returns {Promise<*|null>}
 * @private
 */
var _findCookieWithQlClient = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(ql, pin) {
    var _found$, _found$2;
    var envs, found;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          if (!(!pin || !ql)) {
            _context5.n = 1;
            break;
          }
          return _context5.a(2);
        case 1:
          _context5.n = 2;
          return ql.GetEnvs("JD_COOKIE");
        case 2:
          envs = _context5.v;
          if (isNaN(pin)) {
            _context5.n = 3;
            break;
          }
          return _context5.a(2, envs[pin - 1].value);
        case 3:
          pin = encodeURIComponent(decodeURIComponent(pin));
          found = envs.filter(function (e) {
            return e.value.indexOf(pin) > -1;
          });
          if (!(found.length !== 1)) {
            _context5.n = 4;
            break;
          }
          return _context5.a(2);
        case 4:
          return _context5.a(2, ((_found$ = found[0]) === null || _found$ === void 0 ? void 0 : _found$.status) === 0 ? (_found$2 = found[0]) === null || _found$2 === void 0 ? void 0 : _found$2.value : null);
      }
    }, _callee5);
  }));
  return function _findCookieWithQlClient(_x4, _x5) {
    return _ref5.apply(this, arguments);
  };
}();

/**
 * 使用于类似如下的命令
 * [cmd] [ql] [pin] 指定青龙和账号
 * [cmd] [pin] 指定账号
 * [cmd] 默认查询，让选账号
 * 其中，ql参数会根据当前青龙配置的focus和mode进行自动判断
 * 通过当前用户角色和传入的参数，查找需要执行的cookie
 */
var obtainExecCookieBySender = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var pin, cookie, qlIndex, pinIndex, _cookie, _cookie2, isAdmin, qls, qlClient, _t7, _t8, _t9, _t0;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          _context6.n = 1;
          return s.param('ql');
        case 1:
          _t7 = _context6.v;
          if (_t7) {
            _context6.n = 2;
            break;
          }
          _t7 = "";
        case 2:
          qlIndex = _t7;
          _context6.n = 3;
          return s.param('pin');
        case 3:
          _t8 = _context6.v;
          if (_t8) {
            _context6.n = 4;
            break;
          }
          _t8 = "";
        case 4:
          pinIndex = _t8;
          if (!(!qlIndex && !pinIndex)) {
            _context6.n = 8;
            break;
          }
          _context6.n = 5;
          return chooseJdUserPin();
        case 5:
          pin = _context6.v;
          if (pin) {
            _context6.n = 6;
            break;
          }
          return _context6.a(2);
        case 6:
          _context6.n = 7;
          return getAlCookies();
        case 7:
          _t9 = pin;
          cookie = _context6.v[_t9];
          return _context6.a(2, {
            pin: pin,
            cookie: (_cookie = cookie) === null || _cookie === void 0 ? void 0 : _cookie.value,
            isAdmin: false
          });
        case 8:
          if (!(qlIndex && !pinIndex)) {
            _context6.n = 12;
            break;
          }
          _context6.n = 9;
          return chooseJdUserPin(qlIndex);
        case 9:
          pin = _context6.v;
          if (pin) {
            _context6.n = 10;
            break;
          }
          return _context6.a(2);
        case 10:
          _context6.n = 11;
          return getAlCookies();
        case 11:
          _t0 = pin;
          cookie = _context6.v[_t0];
          return _context6.a(2, {
            pin: pin,
            cookie: (_cookie2 = cookie) === null || _cookie2 === void 0 ? void 0 : _cookie2.value,
            isAdmin: false
          });
        case 12:
          _context6.n = 13;
          return s.isAdmin();
        case 13:
          isAdmin = _context6.v;
          if (isAdmin) {
            _context6.n = 14;
            break;
          }
          return _context6.a(2);
        case 14:
          if (!(isNaN(qlIndex) || qlIndex < 0)) {
            _context6.n = 15;
            break;
          }
          logger.error("\u7BA1\u7406\u5458\u6307\u4EE4\u9519\u8BEF\uFF0Cql\u53C2\u6570\u5E94\u8BE5\u662F\u6570\u5B57\uFF0C\u8868\u793A\u7B2C\u51E0\u4E2A\u9752\u9F99\uFF0C\u5F53\u524D\u4F20\u7684\u662F".concat(qlIndex));
          return _context6.a(2);
        case 15:
          _context6.n = 16;
          return getQlClientWithMode(0, 2);
        case 16:
          qls = _context6.v;
          qlClient = qls[qlIndex] || qls[0];
          _context6.n = 17;
          return _findCookieWithQlClient(qlClient, pinIndex);
        case 17:
          cookie = _context6.v;
          pin = encodeURIComponent(decodeURIComponent(extractPin(cookie)));
          return _context6.a(2, {
            pin: pin,
            cookie: cookie,
            isAdmin: true
          });
      }
    }, _callee6);
  }));
  return function obtainExecCookieBySender() {
    return _ref6.apply(this, arguments);
  };
}();

/**
 * 从环境变量中提取UID
 * @param env
 * @returns {string}
 */
var extractUIDFromEnv = function extractUIDFromEnv(env) {
  if (!env || !env.remarks || env.remarks.indexOf("UID_") === -1) {
    return;
  }
  var matched = env.remarks.match(/(UID_.+)@@|(UID_.+)/);
  if (matched) {
    return matched[0].split("@@")[0];
  }
};

/**
 * 设置查询频率限制
 * @returns {Promise<number>}
 */
var thresholdGet = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
    var userId, thresholdConfig, limit, lastQueryTime, now, time, _t1;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          _context7.n = 1;
          return s.getUserId();
        case 1:
          userId = _context7.v;
          thresholdConfig = new Bucket('thresholdConfig');
          _context7.n = 2;
          return thresholdConfig.get('limit');
        case 2:
          _t1 = _context7.v;
          if (_t1) {
            _context7.n = 3;
            break;
          }
          _t1 = 2;
        case 3:
          limit = _t1;
          _context7.n = 4;
          return thresholdConfig.get(userId);
        case 4:
          lastQueryTime = _context7.v;
          // 上次查询时间
          now = new Date().getTime();
          logger.debug("limit=".concat(limit, ", lastQueryTime=").concat(lastQueryTime, ", now=").concat(now));
          if (!(lastQueryTime && now - lastQueryTime < limit * 60 * 1000)) {
            _context7.n = 5;
            break;
          }
          // 距离上次查询已经超过10min，则允许
          time = limit * 60 - Math.floor((now - lastQueryTime) / 1000); // await s.reply(`请勿频繁查询，${time}秒后再来!`)
          return _context7.a(2, time);
        case 5:
          return _context7.a(2, 0);
      }
    }, _callee7);
  }));
  return function thresholdGet() {
    return _ref7.apply(this, arguments);
  };
}();

/**
 * 限制查询频率
 * @returns {Promise<boolean>}
 */
var limitRequest = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
    var message_ids, left, _t10, _t11;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          _context8.n = 1;
          return s.getMessageId();
        case 1:
          _t10 = _context8.v;
          message_ids = [_t10];
          _context8.n = 2;
          return thresholdGet();
        case 2:
          left = _context8.v;
          if (!(left > 0)) {
            _context8.n = 5;
            break;
          }
          _t11 = message_ids;
          _context8.n = 3;
          return s.reply("\u8BF7\u52FF\u9891\u7E41\u67E5\u8BE2\uFF0C".concat(left, "\u79D2\u540E\u518D\u6765!"));
        case 3:
          _t11.push.call(_t11, _context8.v);
          _context8.n = 4;
          return recallMsg(message_ids);
        case 4:
          return _context8.a(2, false);
        case 5:
          _context8.n = 6;
          return thresholdSet();
        case 6:
          return _context8.a(2, true);
      }
    }, _callee8);
  }));
  return function limitRequest() {
    return _ref8.apply(this, arguments);
  };
}();
var thresholdSet = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
    var userId, thresholdConfig;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          _context9.n = 1;
          return s.getUserId();
        case 1:
          userId = _context9.v;
          thresholdConfig = new Bucket('thresholdConfig');
          _context9.n = 2;
          return thresholdConfig.set(userId, new Date().getTime());
        case 2:
          return _context9.a(2);
      }
    }, _callee9);
  }));
  return function thresholdSet() {
    return _ref9.apply(this, arguments);
  };
}();

/**
 * 获取Bot ID和管理员ID
 * @param platform
 * @returns {Promise<{bot_id: any, admin: (any), platform: string}>}
 */
var getBotAndMaster = /*#__PURE__*/function () {
  var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
    var _ref1;
    var platform,
      x,
      bot_id,
      token,
      adminStr,
      admin,
      _args0 = arguments;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.n) {
        case 0:
          platform = _args0.length > 0 && _args0[0] !== undefined ? _args0[0] : 'tg';
          x = new Bucket(platform);
          _context0.n = 1;
          return x.get('bot_id', false);
        case 1:
          bot_id = _context0.v;
          if (!platform.startsWith('tg')) {
            _context0.n = 3;
            break;
          }
          _context0.n = 2;
          return x.get('token', null);
        case 2:
          token = _context0.v;
          if (token && token.indexOf(':') > -1) {
            bot_id = token.split(':')[0];
          }
        case 3:
          _context0.n = 4;
          return x.get('masters', "");
        case 4:
          adminStr = _context0.v;
          admin = (_ref1 = adminStr && ((adminStr === null || adminStr === void 0 ? void 0 : adminStr.indexOf('&')) === 0 ? adminStr === null || adminStr === void 0 ? void 0 : adminStr.split('&')[1] : adminStr === null || adminStr === void 0 ? void 0 : adminStr.split('&')[0])) !== null && _ref1 !== void 0 ? _ref1 : null;
          logger.debug("Bot and Master. bot_id: ".concat(bot_id, ", admin: ").concat(admin, ", platform: ").concat(platform));
          return _context0.a(2, {
            bot_id: bot_id,
            admin: admin,
            platform: platform
          });
      }
    }, _callee0);
  }));
  return function getBotAndMaster() {
    return _ref0.apply(this, arguments);
  };
}();

/**
 * 撤回消息
 * @param msgIds
 * @param delay
 * @returns {Promise<void>}
 */
var recallMsg = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
    var msgIds,
      delay,
      newMsgIds,
      _iterator5,
      _step5,
      msgId,
      _args1 = arguments;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.n) {
        case 0:
          msgIds = _args1.length > 0 && _args1[0] !== undefined ? _args1[0] : [];
          delay = _args1.length > 1 && _args1[1] !== undefined ? _args1[1] : 5000;
          msgIds = Array.isArray(msgIds) ? msgIds : [msgIds];
          msgIds = msgIds.filter(function (e) {
            return e && e.trim();
          });
          if (!(msgIds.length === 0)) {
            _context1.n = 1;
            break;
          }
          return _context1.a(2);
        case 1:
          newMsgIds = [];
          _iterator5 = _createForOfIteratorHelper(msgIds);
          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              msgId = _step5.value;
              if (msgId.indexOf('@@@') > -1) {
                newMsgIds.push.apply(newMsgIds, _toConsumableArray(msgId.split('@@@')));
              } else {
                newMsgIds.push(msgId);
              }
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
          logger.debug('recallMsg', newMsgIds);
          _context1.n = 2;
          return sleep(delay);
        case 2:
          _context1.n = 3;
          return s.doAction({
            type: 'delete_message',
            message_ids: newMsgIds
          });
        case 3:
          return _context1.a(2);
      }
    }, _callee1);
  }));
  return function recallMsg() {
    return _ref10.apply(this, arguments);
  };
}();

/**
 * 等待用户输入
 * @param tipMsg 提示消息
 * @param reg 正则表达式，验证输入内容
 * @param errMsg {string|null} 错误提示消息，默认是"输入错误，{tipMsg}"
 * @param tryNum {number} 尝试次数，默认3次
 * @param delMsg {boolean} 是否删除消息，默认false
 * @param delDaly {number} 删除延迟时间，默认5000ms
 * @returns {Promise<String>}
 */
var wait4Input = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(tipMsg, reg) {
    var _ref12,
      _ref12$errMsg,
      errMsg,
      _ref12$tryNum,
      tryNum,
      _ref12$delMsg,
      delMsg,
      _ref12$delDaly,
      delDaly,
      input,
      _args10 = arguments;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.n) {
        case 0:
          _ref12 = _args10.length > 2 && _args10[2] !== undefined ? _args10[2] : {}, _ref12$errMsg = _ref12.errMsg, errMsg = _ref12$errMsg === void 0 ? null : _ref12$errMsg, _ref12$tryNum = _ref12.tryNum, tryNum = _ref12$tryNum === void 0 ? 3 : _ref12$tryNum, _ref12$delMsg = _ref12.delMsg, delMsg = _ref12$delMsg === void 0 ? false : _ref12$delMsg, _ref12$delDaly = _ref12.delDaly, delDaly = _ref12$delDaly === void 0 ? 5000 : _ref12$delDaly;
          _context10.n = 1;
          return wait4InputFull(tipMsg, reg, {
            errMsg: errMsg,
            tryNum: tryNum,
            delMsg: delMsg,
            delDaly: delDaly
          });
        case 1:
          input = _context10.v;
          _context10.n = 2;
          return input.getContent();
        case 2:
          return _context10.a(2, _context10.v);
      }
    }, _callee10);
  }));
  return function wait4Input(_x6, _x7) {
    return _ref11.apply(this, arguments);
  };
}();

/**
 * 等待用户输入
 * @param tipMsg 提示消息
 * @param reg 正则表达式，验证输入内容
 * @param errMsg {string|null} 错误提示消息，默认是"输入错误，{tipMsg}"
 * @param tryNum {number} 尝试次数，默认3次
 * @param delMsg {boolean} 是否删除消息，默认false
 * @param delDaly {number} 删除延迟时间，默认5000ms
 * @returns {Promise<Sender>}
 */
var wait4InputFull = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(tipMsg, reg) {
    var _ref14,
      _ref14$errMsg,
      errMsg,
      _ref14$tryNum,
      tryNum,
      _ref14$delMsg,
      delMsg,
      _ref14$delDaly,
      delDaly,
      ms,
      input,
      content,
      num,
      _args11 = arguments,
      _t12,
      _t13,
      _t14,
      _t15,
      _t16,
      _t17,
      _t18,
      _t19,
      _t20,
      _t21,
      _t22,
      _t23,
      _t24,
      _t25,
      _t26,
      _t27,
      _t28,
      _t29,
      _t30,
      _t31,
      _t32,
      _t33,
      _t34;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.p = _context11.n) {
        case 0:
          _ref14 = _args11.length > 2 && _args11[2] !== undefined ? _args11[2] : {}, _ref14$errMsg = _ref14.errMsg, errMsg = _ref14$errMsg === void 0 ? null : _ref14$errMsg, _ref14$tryNum = _ref14.tryNum, tryNum = _ref14$tryNum === void 0 ? 3 : _ref14$tryNum, _ref14$delMsg = _ref14.delMsg, delMsg = _ref14$delMsg === void 0 ? false : _ref14$delMsg, _ref14$delDaly = _ref14.delDaly, delDaly = _ref14$delDaly === void 0 ? 5000 : _ref14$delDaly;
          ms = [];
          _t12 = ms;
          _context11.n = 1;
          return s.reply(tipMsg);
        case 1:
          _t12.push.call(_t12, _context11.v);
          _context11.p = 2;
          _context11.n = 3;
          return s.listen({
            timeout: 3 * 60 * 1000
          });
        case 3:
          input = _context11.v;
          _t13 = ms;
          _context11.n = 4;
          return input.getMessageId();
        case 4:
          _t13.push.call(_t13, _context11.v);
          _context11.n = 9;
          break;
        case 5:
          _context11.p = 5;
          _t14 = _context11.v;
          logger.error(_t14);
          _t15 = ms;
          _context11.n = 6;
          return s.reply("超时,已退出");
        case 6:
          _t16 = _context11.v;
          _context11.n = 7;
          return s.getMessageId();
        case 7:
          _t15.push.call(_t15, _t16, _context11.v);
          _t17 = delMsg;
          if (!_t17) {
            _context11.n = 8;
            break;
          }
          _context11.n = 8;
          return recallMsg(ms, delDaly);
        case 8:
          process.exit();
        case 9:
          _context11.n = 10;
          return input.getContent();
        case 10:
          content = _context11.v;
          if (reg) {
            _context11.n = 15;
            break;
          }
          if (!(content === "q" || content === "Q")) {
            _context11.n = 14;
            break;
          }
          _t18 = ms;
          _context11.n = 11;
          return input.reply("已退出");
        case 11:
          _t19 = _context11.v;
          _context11.n = 12;
          return s.getMessageId();
        case 12:
          _t18.push.call(_t18, _t19, _context11.v);
          _t20 = delMsg;
          if (!_t20) {
            _context11.n = 13;
            break;
          }
          _context11.n = 13;
          return recallMsg(ms, delDaly);
        case 13:
          process.exit();
        case 14:
          return _context11.a(2, input);
        case 15:
          _context11.p = 15;
          num = 1;
          errMsg = !errMsg ? "\u8F93\u5165\u9519\u8BEF\uFF0C".concat(tipMsg) : errMsg;
        case 16:
          _t21 = reg;
          _context11.n = 17;
          return input.getContent();
        case 17:
          if (_t21.test.call(_t21, content = _context11.v)) {
            _context11.n = 29;
            break;
          }
          if (!(content === "q" || content === "Q")) {
            _context11.n = 21;
            break;
          }
          _t22 = ms;
          _context11.n = 18;
          return input.reply("已退出");
        case 18:
          _t23 = _context11.v;
          _context11.n = 19;
          return s.getMessageId();
        case 19:
          _t22.push.call(_t22, _t23, _context11.v);
          _t24 = delMsg;
          if (!_t24) {
            _context11.n = 20;
            break;
          }
          _context11.n = 20;
          return recallMsg(ms, delDaly);
        case 20:
          process.exit();
        case 21:
          num++;
          // await s.reply(`验证失败，请输入正确的6位数验证码：`)
          _t25 = ms;
          _context11.n = 22;
          return s.reply(errMsg);
        case 22:
          _t25.push.call(_t25, _context11.v);
          _context11.n = 23;
          return s.listen({
            timeout: 60000
          });
        case 23:
          input = _context11.v;
          _t26 = ms;
          _context11.n = 24;
          return input.getMessageId();
        case 24:
          _t26.push.call(_t26, _context11.v);
          if (!(num > tryNum)) {
            _context11.n = 28;
            break;
          }
          _t27 = ms;
          _context11.n = 25;
          return input.reply("\u8D85\u65F6\u5DF2\u9000\u51FA");
        case 25:
          _t28 = _context11.v;
          _context11.n = 26;
          return s.getMessageId();
        case 26:
          _t27.push.call(_t27, _t28, _context11.v);
          _t29 = delMsg;
          if (!_t29) {
            _context11.n = 27;
            break;
          }
          _context11.n = 27;
          return recallMsg(ms, delDaly);
        case 27:
          process.exit();
        case 28:
          _context11.n = 16;
          break;
        case 29:
          _context11.n = 34;
          break;
        case 30:
          _context11.p = 30;
          _t30 = _context11.v;
          logger.error(_t30);
          _t31 = ms;
          _context11.n = 31;
          return (input || s).reply("超时,已退出");
        case 31:
          _t32 = _context11.v;
          _context11.n = 32;
          return s.getMessageId();
        case 32:
          _t31.push.call(_t31, _t32, _context11.v);
          _t33 = delMsg;
          if (!_t33) {
            _context11.n = 33;
            break;
          }
          _context11.n = 33;
          return recallMsg(ms, delDaly);
        case 33:
          process.exit();
        case 34:
          _t34 = delMsg;
          if (!_t34) {
            _context11.n = 35;
            break;
          }
          _context11.n = 35;
          return recallMsg(ms, delDaly);
        case 35:
          return _context11.a(2, input);
      }
    }, _callee11, null, [[15, 30], [2, 5]]);
  }));
  return function wait4InputFull(_x8, _x9) {
    return _ref13.apply(this, arguments);
  };
}();

/**
 * 保存pin到数据库
 * @param pin
 * @returns {Promise<void>}
 */
var savePin2DB = /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(pin) {
    var platform, userId, pinDB, value, pins, _t35;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.n) {
        case 0:
          if (!(!pin || typeof pin !== 'string' || pin.length === 0)) {
            _context12.n = 1;
            break;
          }
          return _context12.a(2);
        case 1:
          pin = encodeURIComponent(decodeURIComponent(pin));
          _context12.n = 2;
          return s.getPlatform();
        case 2:
          platform = _context12.v;
          _context12.n = 3;
          return s.getUserId();
        case 3:
          userId = _context12.v;
          pinDB = new Bucket('pinDB');
          _context12.n = 4;
          return pinDB.get(platform + ":" + userId);
        case 4:
          _t35 = _context12.v;
          if (_t35) {
            _context12.n = 5;
            break;
          }
          _t35 = false;
        case 5:
          value = _t35;
          if (!value) {
            value = {
              "Pin": [pin],
              "Form": platform,
              "ID": userId,
              "Name": "",
              "NotifyCode": {}
            };
            value.NotifyCode[pin] = 1;
          } else {
            logger.debug(_typeof(value), value);
            if (typeof value === 'string') {
              try {
                value = JSON.parse(value);
              } catch (e) {
                logger.debug("parse error. ".concat(value));
              }
            }
            pins = value["Pin"] || [];
            if (pins.indexOf(pin) === -1) {
              pins.push(pin);
              value["Pin"].pins;
              value.NotifyCode = value.NotifyCode || {};
              value.NotifyCode[pin] = 1;
            }
          }
          _context12.n = 6;
          return pinDB.set(platform + ":" + userId, value);
        case 6:
          return _context12.a(2);
      }
    }, _callee12);
  }));
  return function savePin2DB(_x0) {
    return _ref15.apply(this, arguments);
  };
}();

/**
 * 延迟执行
 * @param t
 * @returns {Promise<unknown>}
 */
var sleep = /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
    var t,
      _args13 = arguments;
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.n) {
        case 0:
          t = _args13.length > 0 && _args13[0] !== undefined ? _args13[0] : 0;
          t = t > 0 ? t : Math.floor((Math.random() * (2 - 1) + 1) * 1000); // 1-2s
          return _context13.a(2, new Promise(function (resolve, reject) {
            setTimeout(resolve, t);
          }));
      }
    }, _callee13);
  }));
  return function sleep() {
    return _ref16.apply(this, arguments);
  };
}();

/**
 * 提取代理信息
 * @param proxyIp {string|null} 代理地址
 * @param options {object} 请求选项
 * @param proxy {object} 代理配置
 */
function extractAgent(proxyIp, options) {
  var proxy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (proxyIp) {
    var proxyUrl = proxyIp.includes('://') ? proxyIp : "http://".concat(proxyIp);
    options.httpsAgent = new HttpsProxyAgent(proxyUrl);
  } else if (proxy.host && proxy.port) {
    // 使用默认代理
    options.httpsAgent = new HttpsProxyAgent("".concat(proxy.protocol || 'http', "://").concat(proxy.host, ":").concat(proxy.port));
  }
}

/**
 * 推送管理员通知
 * @param content {string} 通知内容
 * @param platform {string} 平台，默认'tg'
 * @returns {Promise<void>}
 */
function pushAdminNotice(_x1) {
  return _pushAdminNotice.apply(this, arguments);
}
/**
 * 推送给作者群通知
 * @param content {string} 通知内容
 * @param platform {string} 平台，默认'qq'
 * @param chat_id {string} 群号
 * @returns {Promise<void>}
 */
function _pushAdminNotice() {
  _pushAdminNotice = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(content) {
    var platform,
      config,
      adapter,
      _args18 = arguments;
    return _regenerator().w(function (_context18) {
      while (1) switch (_context18.n) {
        case 0:
          platform = _args18.length > 1 && _args18[1] !== undefined ? _args18[1] : 'tg2';
          _context18.n = 1;
          return getBotAndMaster(platform);
        case 1:
          config = _context18.v;
          if (!(!config || !config.admin)) {
            _context18.n = 2;
            break;
          }
          logger.error("\u672A\u914D\u7F6E".concat(platform, "\u7BA1\u7406\u5458masters"));
          return _context18.a(2);
        case 2:
          adapter = new Adapter(config);
          _context18.n = 3;
          return adapter.push({
            user_id: config.admin,
            content: content
          });
        case 3:
          return _context18.a(2);
      }
    }, _callee18);
  }));
  return _pushAdminNotice.apply(this, arguments);
}
function pushAuthorNotice(_x10) {
  return _pushAuthorNotice.apply(this, arguments);
}
/**
 * 发送通知
 * @param pin
 * @param content
 * @returns {Promise<void>}
 */
function _pushAuthorNotice() {
  _pushAuthorNotice = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19(content) {
    var platform,
      chat_id,
      sillyGirl,
      machine_id,
      config,
      adapter,
      _args19 = arguments;
    return _regenerator().w(function (_context19) {
      while (1) switch (_context19.n) {
        case 0:
          platform = _args19.length > 1 && _args19[1] !== undefined ? _args19[1] : 'qq';
          chat_id = _args19.length > 2 && _args19[2] !== undefined ? _args19[2] : '';
          // 从app中获取machine_id，判断是否是作者群，是则推送
          sillyGirl = new Bucket('sillyGirl');
          _context19.n = 1;
          return sillyGirl.get('machine_id', '');
        case 1:
          machine_id = _context19.v;
          if (!(machine_id !== 'f1f7348a57dd9af0464d415231b8aeb3a6799a86870e8d1098b53af759a12c1d')) {
            _context19.n = 2;
            break;
          }
          return _context19.a(2);
        case 2:
          _context19.n = 3;
          return getBotAndMaster(platform);
        case 3:
          config = _context19.v;
          if (!(!config || !config.admin)) {
            _context19.n = 4;
            break;
          }
          logger.error("\u672A\u914D\u7F6E".concat(platform, "\u7BA1\u7406\u5458masters"));
          return _context19.a(2);
        case 4:
          adapter = new Adapter(config);
          _context19.n = 5;
          return adapter.push({
            user_id: config.admin,
            content: content,
            chat_id: chat_id
          });
        case 5:
          return _context19.a(2);
      }
    }, _callee19);
  }));
  return _pushAuthorNotice.apply(this, arguments);
}
function notice(_x11, _x12) {
  return _notice.apply(this, arguments);
}
/**
 * 获取QingLong客户端
 *
 *     根据ql.mode自动判断使用哪个QingLong
 *     0 专注模式，focus指向client_id
 *     1 询问模式，需用户选择client_id
 *     2 统御模式，全部青龙都生效
 *
 * @param qlIndex {string|number} client_id或index
 * @param forceMode {number} 强势指定模式，默认-1不强制
 * @returns {Promise<QingLong[]>}
 */
function _notice() {
  _notice = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20(pin, content) {
    var noticeDB, wx, qq, user, adapter, _t39, _t40, _t41, _t42;
    return _regenerator().w(function (_context20) {
      while (1) switch (_context20.n) {
        case 0:
          noticeDB = new Bucket('notice');
          _context20.n = 1;
          return noticeDB.get('wx', false);
        case 1:
          wx = _context20.v;
          _context20.n = 2;
          return noticeDB.get('qq', false);
        case 2:
          qq = _context20.v;
          if (!wx) {
            _context20.n = 5;
            break;
          }
          _context20.n = 3;
          return getUserInfoByPin(pin, 'wx');
        case 3:
          user = _context20.v;
          _t39 = Adapter;
          _context20.n = 4;
          return getBotAndMaster('wx');
        case 4:
          _t40 = _context20.v;
          adapter = new _t39(_t40);
          _context20.n = 8;
          break;
        case 5:
          if (!qq) {
            _context20.n = 8;
            break;
          }
          _context20.n = 6;
          return getUserInfoByPin(pin, 'qq');
        case 6:
          user = _context20.v;
          _t41 = Adapter;
          _context20.n = 7;
          return getBotAndMaster('qq');
        case 7:
          _t42 = _context20.v;
          adapter = new _t41(_t42);
        case 8:
          if (user) {
            _context20.n = 9;
            break;
          }
          logger.error("wx: ".concat(wx, ", qq: ").concat(qq, " \u672A\u67E5\u627E\u5230\u7528\u6237@@").concat(pin, "@@").concat(content));
          return _context20.a(2);
        case 9:
          if (adapter) {
            _context20.n = 10;
            break;
          }
          logger.error("wx: ".concat(wx, ", qq: ").concat(qq, " \u672A\u67E5\u627E\u5230\u9002\u914D\u5668@@").concat(pin, "@@").concat(content));
          return _context20.a(2);
        case 10:
          logger.debug("user: ".concat(JSON.stringify(user), ", user.ID: ").concat(user.ID, " adapter: ").concat(JSON.stringify(adapter), " content: ").concat(content));
          _context20.n = 11;
          return adapter.push({
            user_id: user.ID,
            content: content
          });
        case 11:
          return _context20.a(2);
      }
    }, _callee20);
  }));
  return _notice.apply(this, arguments);
}
var getQlClientWithMode = /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15() {
    var qlIndex,
      forceMode,
      qinglong,
      keys,
      qlDb,
      mode,
      focus,
      client_id,
      initQlInstance,
      _initQlInstance,
      qlClients,
      _iterator6,
      _step6,
      _client_id,
      ql,
      _ql,
      index,
      _ql2,
      _args15 = arguments,
      _t36,
      _t37;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.p = _context15.n) {
        case 0:
          _initQlInstance = function _initQlInstance3() {
            _initQlInstance = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(client_id) {
              var _ql$token;
              var ql_config, _ql_config, address, client_secret, tk, ql;
              return _regenerator().w(function (_context14) {
                while (1) switch (_context14.n) {
                  case 0:
                    _context14.n = 1;
                    return qinglong.get(client_id);
                  case 1:
                    ql_config = _context14.v;
                    if (typeof ql_config === 'string') {
                      ql_config = JSON.parse(ql_config);
                    }
                    _ql_config = ql_config, address = _ql_config.address, client_secret = _ql_config.client_secret, tk = _ql_config.tk;
                    _context14.n = 2;
                    return QingLong.create(address, client_id, client_secret, tk);
                  case 2:
                    ql = _context14.v;
                    if (!ql) {
                      logger.error("\u521D\u59CB\u5316\u9752\u9F99\u5B9E\u4F8B\u5931\u8D25: [".concat(client_id, "]"));
                      process.exit();
                    }
                    if (!((ql === null || ql === void 0 || (_ql$token = ql.token) === null || _ql$token === void 0 ? void 0 : _ql$token.token) !== (tk === null || tk === void 0 ? void 0 : tk.token))) {
                      _context14.n = 3;
                      break;
                    }
                    // token过期，需要重新设置
                    ql_config.tk = ql_config.token = ql.token;
                    _context14.n = 3;
                    return qinglong.set(client_id, ql_config);
                  case 3:
                    return _context14.a(2, ql);
                }
              }, _callee14);
            }));
            return _initQlInstance.apply(this, arguments);
          };
          initQlInstance = function _initQlInstance2(_x13) {
            return _initQlInstance.apply(this, arguments);
          };
          qlIndex = _args15.length > 0 && _args15[0] !== undefined ? _args15[0] : 0;
          forceMode = _args15.length > 1 && _args15[1] !== undefined ? _args15[1] : -1;
          qinglong = new Bucket('qinglong');
          _context15.n = 1;
          return qinglong.keys();
        case 1:
          keys = _context15.v;
          if (keys.length === 0) {
            logger.error('请先去安装QingLong，并进行配置');
            process.exit();
          }
          qlDb = new Bucket('ql');
          if (!(forceMode >= 0)) {
            _context15.n = 2;
            break;
          }
          _t36 = forceMode;
          _context15.n = 4;
          break;
        case 2:
          _context15.n = 3;
          return qlDb.get('mode', 1);
        case 3:
          _t36 = _context15.v;
        case 4:
          mode = _t36;
          _context15.n = 5;
          return qlDb.get('focus', null);
        case 5:
          focus = _context15.v;
          qlClients = [];
          if (!(mode === 2)) {
            _context15.n = 14;
            break;
          }
          // 统御模式，返回全部青龙对象
          _iterator6 = _createForOfIteratorHelper(keys);
          _context15.p = 6;
          _iterator6.s();
        case 7:
          if ((_step6 = _iterator6.n()).done) {
            _context15.n = 10;
            break;
          }
          _client_id = _step6.value;
          _context15.n = 8;
          return initQlInstance(_client_id);
        case 8:
          ql = _context15.v;
          qlClients.push(ql);
        case 9:
          _context15.n = 7;
          break;
        case 10:
          _context15.n = 12;
          break;
        case 11:
          _context15.p = 11;
          _t37 = _context15.v;
          _iterator6.e(_t37);
        case 12:
          _context15.p = 12;
          _iterator6.f();
          return _context15.f(12);
        case 13:
          _context15.n = 19;
          break;
        case 14:
          if (!(mode === 0)) {
            _context15.n = 16;
            break;
          }
          if (!(client_id = focus)) {
            logger.error("\u4E13\u6CE8\u6A21\u5F0F\u4E0B\uFF0C\u8BF7\u5148\u8BBE\u7F6Efocus\u9752\u9F99client_id");
            process.exit();
          }
          _context15.n = 15;
          return initQlInstance(client_id);
        case 15:
          _ql = _context15.v;
          qlClients.push(_ql);
          _context15.n = 19;
          break;
        case 16:
          if (!(mode === 1)) {
            _context15.n = 18;
            break;
          }
          if (Number.isInteger(qlIndex) || /^\d+$/.test(qlIndex)) {
            // 传入的是index
            index = parseInt(qlIndex);
            if (index < 0 || index >= keys.length) {
              logger.error("qlIndex\u53C2\u6570\u9519\u8BEF: [".concat(qlIndex, "]\uFF0C\u5F53\u524D\u4EC5\u914D\u7F6E\u4E86").concat(keys.length, "\u4E2A\u9752\u9F99\u5B9E\u4F8B"));
              process.exit();
            }
            client_id = keys[index];
          } else if (keys.includes(qlIndex)) {
            // 传入的是client_id
            client_id = qlIndex;
          } else {
            logger.error("qlIndex\u53C2\u6570\u9519\u8BEF: [".concat(qlIndex, "]\uFF0C\u672A\u5339\u914D\u5230\u9752\u9F99\u5B9E\u4F8B"));
            process.exit();
          }
          // logger.debug(`qlIndex: ${qlIndex}, client_id: ${client_id}`)
          _context15.n = 17;
          return initQlInstance(client_id);
        case 17:
          _ql2 = _context15.v;
          qlClients.push(_ql2);
          _context15.n = 19;
          break;
        case 18:
          logger.error("ql.mode\u53C2\u6570\u9519\u8BEF: [".concat(mode, "]"));
          process.exit();
        case 19:
          return _context15.a(2, qlClients);
      }
    }, _callee15, null, [[6, 11, 12, 13]]);
  }));
  return function getQlClientWithMode() {
    return _ref17.apply(this, arguments);
  };
}();

/**
 * 获取所有青龙中的JD_COOKIE。
 * 注意：如果是统御模式，可能会有重复的cookie，需要根据pin去重
 * @returns {Promise<{}>}
 */
var getAlCookies = /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16() {
    var qlClients, cks, _iterator7, _step7, ql, cookies, uniqueCks, _i, _cks, ck, pin, _t38;
    return _regenerator().w(function (_context16) {
      while (1) switch (_context16.p = _context16.n) {
        case 0:
          _context16.n = 1;
          return getQlClientWithMode(0, 2);
        case 1:
          qlClients = _context16.v;
          // 统御模式，查询全部
          cks = [];
          _iterator7 = _createForOfIteratorHelper(qlClients);
          _context16.p = 2;
          _iterator7.s();
        case 3:
          if ((_step7 = _iterator7.n()).done) {
            _context16.n = 6;
            break;
          }
          ql = _step7.value;
          _context16.n = 4;
          return ql.GetEnvs('JD_COOKIE');
        case 4:
          cookies = _context16.v;
          cks.push.apply(cks, _toConsumableArray(cookies));
        case 5:
          _context16.n = 3;
          break;
        case 6:
          _context16.n = 8;
          break;
        case 7:
          _context16.p = 7;
          _t38 = _context16.v;
          _iterator7.e(_t38);
        case 8:
          _context16.p = 8;
          _iterator7.f();
          return _context16.f(8);
        case 9:
          // 根据pin去重
          uniqueCks = {};
          _i = 0, _cks = cks;
        case 10:
          if (!(_i < _cks.length)) {
            _context16.n = 13;
            break;
          }
          ck = _cks[_i];
          if (!(ck.status !== 0)) {
            _context16.n = 11;
            break;
          }
          return _context16.a(3, 12);
        case 11:
          pin = extractPin(ck.value);
          if (pin && !uniqueCks[pin]) {
            uniqueCks[pin] = ck;
          }
        case 12:
          _i++;
          _context16.n = 10;
          break;
        case 13:
          return _context16.a(2, uniqueCks);
      }
    }, _callee16, null, [[2, 7, 8, 9]]);
  }));
  return function getAlCookies() {
    return _ref18.apply(this, arguments);
  };
}();

/**
 * 获取QingLong客户端
 * @param qlIndex
 * @returns {Promise<QingLong>}
 */
var getQlClient = /*#__PURE__*/function () {
  var _ref19 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17() {
    var qlIndex,
      _args17 = arguments;
    return _regenerator().w(function (_context17) {
      while (1) switch (_context17.n) {
        case 0:
          qlIndex = _args17.length > 0 && _args17[0] !== undefined ? _args17[0] : 0;
          _context17.n = 1;
          return getQlClientWithMode(qlIndex, 1);
        case 1:
          return _context17.a(2, _context17.v[0]);
      }
    }, _callee17);
  }));
  return function getQlClient() {
    return _ref19.apply(this, arguments);
  };
}();
module.exports = {
  extractPin: extractPin,
  extractCookie: extractCookie,
  getUserInfoByPin: getUserInfoByPin,
  getUsersByPlatform: getUsersByPlatform,
  getUser: getUser,
  chooseJdUserPin: chooseJdUserPin,
  obtainExecCookieBySender: obtainExecCookieBySender,
  extractUIDFromEnv: extractUIDFromEnv,
  limitRequest: limitRequest,
  getBotAndMaster: getBotAndMaster,
  recallMsg: recallMsg,
  wait4Input: wait4Input,
  wait4InputFull: wait4InputFull,
  savePin2DB: savePin2DB,
  sleep: sleep,
  _requiredParam: _requiredParam,
  logger: logger,
  extractAgent: extractAgent,
  notice: notice,
  pushAdminNotice: pushAdminNotice,
  pushAuthorNotice: pushAuthorNotice,
  getQlClient: getQlClient,
  getQlClientWithMode: getQlClientWithMode,
  loginTip: "\u56DE\u590D\u5173\u952E\u5B57\u201C\u4E0A\u8F66\u201D\u8585JD\u7F8A\u6BDB"
};
// “短信登录”：手机号+短信验证码登录。

// “口令登陆”：收到口令后，打开京东APP进行确认。如果APP没跳出口令，就杀掉京东APP重新打开。
// PS，如果以上都不成功，就浏览器打开 https://rabbitro.wuyang.cf ，选择“唤醒京东登陆”，或“扫码登陆”，或“短信登录”

/***/ },

/***/ 520
(module) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function escapeCQ() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return value.replace(/&/g, '&amp;').replace(/\[/g, '&#91;').replace(/]/g, '&#93;').replace(/,/g, '&#44;').replace(/\r?\n/g, '\\n'); // 换行转义为 \n
}
function unescapeCQ() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var unescapeMap = {
    '&amp;': '&',
    '&#91;': '[',
    '&#93;': ']',
    '&#44;': ','
    // 这里可以扩展其他实体
  };
  var s = value.replace(/&[a-zA-Z0-9#]+;/g, function (m) {
    return unescapeMap[m] || m;
  });
  return s.replace(/\\n/g, '\n'); // 转义换行还原
}

// 2. 构建单个 CQ 标签
function buildCQTag(type) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var params = Object.entries(data).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      k = _ref2[0],
      v = _ref2[1];
    return "".concat(k, "=").concat(escapeCQ(String(v)));
  }).join(',');
  return "[CQ:".concat(type).concat(params ? ',' + params : '', "]");
}

// 3. 解析多段文本 → 数组（文本为 string，CQ 为对象）
function parseCQText(text) {
  var cqRegex = /\[CQ:([a-zA-Z0-9_]+)(?:,(.*?))?]/g;
  var lastIndex = 0;
  var result = [];
  var _iterator = _createForOfIteratorHelper(text.matchAll(cqRegex)),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var match = _step.value;
      // 普通文本
      if (match.index > lastIndex) {
        var plainText = text.slice(lastIndex, match.index);
        if (plainText) result.push(plainText);
      }

      // CQ 标签解析
      var _match = _slicedToArray(match, 3),
        type = _match[1],
        paramStr = _match[2];
      var params = {};
      if (paramStr) {
        var regex = /(\w+)=((?:[^,]|&#44;)+)/g;
        var m = void 0;
        while ((m = regex.exec(paramStr)) !== null) {
          params[m[1]] = unescapeCQ(m[2]);
        }
      }
      result.push({
        type: type,
        params: params
      });
      lastIndex = match.index + match[0].length;
    }

    // 剩余文本
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }
  return result;
}

// 4. 构建多段文本（数组 → 字符串）
function buildMultiCQText(segments) {
  return segments.map(function (seg) {
    if (typeof seg === 'string') {
      return seg; // 普通文本直接拼接
    } else if (seg && _typeof(seg) === 'object' && seg.type) {
      return buildCQTag(seg.type, seg.params);
    } else {
      return ''; // 无效段落
    }
  }).join('');
}

// 5. 导出统一工具
var CQ = {
  buildCQTag: buildCQTag,
  parseCQText: parseCQText,
  buildMultiCQText: buildMultiCQText
};
module.exports = CQ;

/***/ },

/***/ 498
(module, __unused_webpack_exports, __webpack_require__) {

function safeRequire(moduleName) {
  try {
    return __webpack_require__(213)(moduleName);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND' && err.message.includes(moduleName)) {
      console.log("\u6A21\u5757 \"".concat(moduleName, "\" \u672A\u627E\u5230\uFF0C\u6B63\u5728\u4F7F\u7528 mock \u7248\u672C..."));
      return __webpack_require__(315);
    }
    throw err; // 其他错误继续抛出
  }
}
var sg = safeRequire('sillygirl');
var _require = __webpack_require__(520),
  parseCQText = _require.parseCQText,
  buildCQTag = _require.buildCQTag;
sg.utils.buildCQTag = buildCQTag;
sg.utils.parseCQText = parseCQText;
sg.utils.sleep = function (ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
};
module.exports = sg;

/***/ },

/***/ 315
(module, __unused_webpack_exports, __webpack_require__) {

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
console.log("\u5F53\u524D\u6B63\u5728\u4F7F\u7528mock\u7248\u672C\u7684sillygirl\u6A21\u5757");
var redisClient = {};
if (process.env.RUN_MODE === 'MOCK') {
  var Redis = __webpack_require__(659);
  redisClient = global.__SG_REDIS__ = global.__SG_REDIS__ || new Redis({
    host: '10.241.1.12',
    port: 6379
  }); // 默认连接本地，也可传 host/port 配置
}
var Sender = /*#__PURE__*/function () {
  function Sender(uuid) {
    _classCallCheck(this, Sender);
    this.uuid = uuid;
    this.destoried = false;
    this._data = {
      userId: "mock-user-id",
      userName: "mock-user-name",
      chatId: "mock-chat-id",
      chatName: "mock-chat-name",
      messageId: "mock-message-id",
      platform: "mock-platform",
      botId: "mock-bot-id",
      content: "mock-content"
    };
  }
  return _createClass(Sender, [{
    key: "destroy",
    value: function destroy() {
      this.destoried = true;
    }
  }, {
    key: "getUserId",
    value: function () {
      var _getUserId = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              return _context.a(2, this._data.userId);
          }
        }, _callee, this);
      }));
      function getUserId() {
        return _getUserId.apply(this, arguments);
      }
      return getUserId;
    }()
  }, {
    key: "getUserName",
    value: function () {
      var _getUserName = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              return _context2.a(2, this._data.userName);
          }
        }, _callee2, this);
      }));
      function getUserName() {
        return _getUserName.apply(this, arguments);
      }
      return getUserName;
    }()
  }, {
    key: "getChatId",
    value: function () {
      var _getChatId = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              return _context3.a(2, this._data.chatId);
          }
        }, _callee3, this);
      }));
      function getChatId() {
        return _getChatId.apply(this, arguments);
      }
      return getChatId;
    }()
  }, {
    key: "getChatName",
    value: function () {
      var _getChatName = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              return _context4.a(2, this._data.chatName);
          }
        }, _callee4, this);
      }));
      function getChatName() {
        return _getChatName.apply(this, arguments);
      }
      return getChatName;
    }()
  }, {
    key: "getMessageId",
    value: function () {
      var _getMessageId = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              return _context5.a(2, this._data.messageId);
          }
        }, _callee5, this);
      }));
      function getMessageId() {
        return _getMessageId.apply(this, arguments);
      }
      return getMessageId;
    }()
  }, {
    key: "getPlatform",
    value: function () {
      var _getPlatform = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              return _context6.a(2, this._data.platform);
          }
        }, _callee6, this);
      }));
      function getPlatform() {
        return _getPlatform.apply(this, arguments);
      }
      return getPlatform;
    }()
  }, {
    key: "getBotId",
    value: function () {
      var _getBotId = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              return _context7.a(2, this._data.botId);
          }
        }, _callee7, this);
      }));
      function getBotId() {
        return _getBotId.apply(this, arguments);
      }
      return getBotId;
    }()
  }, {
    key: "getContent",
    value: function () {
      var _getContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              return _context8.a(2, this._data.content);
          }
        }, _callee8, this);
      }));
      function getContent() {
        return _getContent.apply(this, arguments);
      }
      return getContent;
    }()
  }, {
    key: "isAdmin",
    value: function () {
      var _isAdmin = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              return _context9.a(2, true);
          }
        }, _callee9);
      }));
      function isAdmin() {
        return _isAdmin.apply(this, arguments);
      }
      return isAdmin;
    }()
  }, {
    key: "param",
    value: function () {
      var _param = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(key) {
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.n) {
            case 0:
              if (!(typeof key === "string" && this._data[key])) {
                _context0.n = 1;
                break;
              }
              return _context0.a(2, this._data[key]);
            case 1:
              return _context0.a(2, "");
          }
        }, _callee0, this);
      }));
      function param(_x) {
        return _param.apply(this, arguments);
      }
      return param;
    }()
  }, {
    key: "setContent",
    value: function () {
      var _setContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(content) {
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.n) {
            case 0:
              this._data.content = content;
            case 1:
              return _context1.a(2);
          }
        }, _callee1, this);
      }));
      function setContent(_x2) {
        return _setContent.apply(this, arguments);
      }
      return setContent;
    }()
  }, {
    key: "continue",
    value: function () {
      var _continue2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.n) {
            case 0:
              return _context10.a(2);
          }
        }, _callee10);
      }));
      function _continue() {
        return _continue2.apply(this, arguments);
      }
      return _continue;
    }()
  }, {
    key: "getAdapter",
    value: function () {
      var _getAdapter = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.n) {
            case 0:
              return _context11.a(2, new Adapter({
                platform: "mock-platform",
                bot_id: "mock-bot-id"
              }));
          }
        }, _callee11);
      }));
      function getAdapter() {
        return _getAdapter.apply(this, arguments);
      }
      return getAdapter;
    }()
  }, {
    key: "listen",
    value: function () {
      var _listen = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(options) {
        return _regenerator().w(function (_context12) {
          while (1) switch (_context12.n) {
            case 0:
              return _context12.a(2, new Sender("mock-listen-uuid"));
          }
        }, _callee12);
      }));
      function listen(_x3) {
        return _listen.apply(this, arguments);
      }
      return listen;
    }()
  }, {
    key: "holdOn",
    value: function holdOn(str) {
      return "holdOn:" + str;
    }
  }, {
    key: "reply",
    value: function () {
      var _reply = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(content) {
        return _regenerator().w(function (_context13) {
          while (1) switch (_context13.n) {
            case 0:
              return _context13.a(2, "reply: " + content);
          }
        }, _callee13);
      }));
      function reply(_x4) {
        return _reply.apply(this, arguments);
      }
      return reply;
    }()
  }, {
    key: "doAction",
    value: function () {
      var _doAction = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(options) {
        return _regenerator().w(function (_context14) {
          while (1) switch (_context14.n) {
            case 0:
              return _context14.a(2, {
                mock: true,
                options: options
              });
          }
        }, _callee14);
      }));
      function doAction(_x5) {
        return _doAction.apply(this, arguments);
      }
      return doAction;
    }()
  }, {
    key: "getEvent",
    value: function () {
      var _getEvent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15() {
        return _regenerator().w(function (_context15) {
          while (1) switch (_context15.n) {
            case 0:
              return _context15.a(2, {
                event: "mock",
                uuid: this.uuid
              });
          }
        }, _callee15, this);
      }));
      function getEvent() {
        return _getEvent.apply(this, arguments);
      }
      return getEvent;
    }()
  }]);
}();
var Bucket = /*#__PURE__*/function () {
  function Bucket(name) {
    _classCallCheck(this, Bucket);
    this.name = name;
  }
  return _createClass(Bucket, [{
    key: "transform",
    value: function transform(v) {
      if (v === undefined) return undefined;
      if (v === "true") return true;
      if (v === "false") return false;
      var n = Number(v);
      if (!isNaN(n)) return n;
      return v;
    }
  }, {
    key: "reverseTransform",
    value: function reverseTransform(value) {
      return value === undefined ? "" : String(value);
    }
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(key, defaultValue) {
        var value, _t;
        return _regenerator().w(function (_context16) {
          while (1) switch (_context16.p = _context16.n) {
            case 0:
              _context16.n = 1;
              return redisClient.hget(this.name, key);
            case 1:
              value = _context16.v;
              if (!(value === null || value === undefined)) {
                _context16.n = 2;
                break;
              }
              return _context16.a(2, defaultValue);
            case 2:
              if (!value.startsWith("o:")) {
                _context16.n = 5;
                break;
              }
              _context16.p = 3;
              return _context16.a(2, JSON.parse(value.substring(2)));
            case 4:
              _context16.p = 4;
              _t = _context16.v;
              return _context16.a(2, this.transform(value));
            case 5:
              if (!value.startsWith("b:")) {
                _context16.n = 6;
                break;
              }
              return _context16.a(2, value.substring(2) === "true");
            case 6:
              if (!value.startsWith("f:")) {
                _context16.n = 7;
                break;
              }
              return _context16.a(2, Number(value.substring(2)));
            case 7:
              return _context16.a(2, this.transform(value));
          }
        }, _callee16, this, [[3, 4]]);
      }));
      function get(_x6, _x7) {
        return _get.apply(this, arguments);
      }
      return get;
    }() // mock存储（redis不写入，也不变更）
  }, {
    key: "set",
    value: function () {
      var _set = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(key, value) {
        return _regenerator().w(function (_context17) {
          while (1) switch (_context17.n) {
            case 0:
              return _context17.a(2, {
                message: "mocked",
                changed: true
              });
          }
        }, _callee17);
      }));
      function set(_x8, _x9) {
        return _set.apply(this, arguments);
      }
      return set;
    }()
  }, {
    key: "getAll",
    value: function () {
      var _getAll = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18() {
        return _regenerator().w(function (_context18) {
          while (1) switch (_context18.n) {
            case 0:
              return _context18.a(2, {});
          }
        }, _callee18);
      }));
      function getAll() {
        return _getAll.apply(this, arguments);
      }
      return getAll;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19(key) {
        return _regenerator().w(function (_context19) {
          while (1) switch (_context19.n) {
            case 0:
              return _context19.a(2, {
                message: "mocked",
                changed: true
              });
          }
        }, _callee19);
      }));
      function _delete(_x0) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
  }, {
    key: "deleteAll",
    value: function () {
      var _deleteAll = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20() {
        return _regenerator().w(function (_context20) {
          while (1) switch (_context20.n) {
            case 0:
              return _context20.a(2);
          }
        }, _callee20);
      }));
      function deleteAll() {
        return _deleteAll.apply(this, arguments);
      }
      return deleteAll;
    }()
  }, {
    key: "keys",
    value: function () {
      var _keys = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21() {
        return _regenerator().w(function (_context21) {
          while (1) switch (_context21.n) {
            case 0:
              return _context21.a(2, redisClient.hkeys(this.name));
          }
        }, _callee21, this);
      }));
      function keys() {
        return _keys.apply(this, arguments);
      }
      return keys;
    }()
  }, {
    key: "len",
    value: function () {
      var _len = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22() {
        return _regenerator().w(function (_context22) {
          while (1) switch (_context22.n) {
            case 0:
              return _context22.a(2, redisClient.hlen(this.name));
          }
        }, _callee22, this);
      }));
      function len() {
        return _len.apply(this, arguments);
      }
      return len;
    }()
  }, {
    key: "buckets",
    value: function () {
      var _buckets = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23() {
        var allKeys, bucketNames, keyTypes, i;
        return _regenerator().w(function (_context23) {
          while (1) switch (_context23.n) {
            case 0:
              _context23.n = 1;
              return redisClient.keys('*');
            case 1:
              allKeys = _context23.v;
              if (!(!allKeys || allKeys.length === 0)) {
                _context23.n = 2;
                break;
              }
              return _context23.a(2, []);
            case 2:
              bucketNames = []; // 获取这些key的类型
              _context23.n = 3;
              return Promise.all(allKeys.map(function (k) {
                return redisClient.type(k);
              }));
            case 3:
              keyTypes = _context23.v;
              for (i = 0; i < allKeys.length; i++) {
                if (keyTypes[i] === 'hash') {
                  bucketNames.push(allKeys[i]);
                }
              }
              return _context23.a(2, bucketNames);
          }
        }, _callee23);
      }));
      function buckets() {
        return _buckets.apply(this, arguments);
      }
      return buckets;
    }()
  }, {
    key: "watch",
    value: function watch(key, handle) {/* 不实现 */
    }
  }, {
    key: "getName",
    value: function () {
      var _getName = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24() {
        return _regenerator().w(function (_context24) {
          while (1) switch (_context24.n) {
            case 0:
              return _context24.a(2, this.name);
          }
        }, _callee24, this);
      }));
      function getName() {
        return _getName.apply(this, arguments);
      }
      return getName;
    }()
  }]);
}();
var Adapter = /*#__PURE__*/function () {
  function Adapter(options) {
    _classCallCheck(this, Adapter);
    this.platform = options.platform;
    this.bot_id = options.bot_id;
    this.call = function () {};
  }
  return _createClass(Adapter, [{
    key: "receive",
    value: function () {
      var _receive = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25(message) {
        return _regenerator().w(function (_context25) {
          while (1) switch (_context25.n) {
            case 0:
              return _context25.a(2);
          }
        }, _callee25);
      }));
      function receive(_x1) {
        return _receive.apply(this, arguments);
      }
      return receive;
    }()
  }, {
    key: "push",
    value: function () {
      var _push = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26(message) {
        return _regenerator().w(function (_context26) {
          while (1) switch (_context26.n) {
            case 0:
              return _context26.a(2, "pushed: " + JSON.stringify(message));
          }
        }, _callee26);
      }));
      function push(_x10) {
        return _push.apply(this, arguments);
      }
      return push;
    }()
  }, {
    key: "destroy",
    value: function () {
      var _destroy = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27() {
        return _regenerator().w(function (_context27) {
          while (1) switch (_context27.n) {
            case 0:
              return _context27.a(2);
          }
        }, _callee27);
      }));
      function destroy() {
        return _destroy.apply(this, arguments);
      }
      return destroy;
    }()
  }, {
    key: "sender",
    value: function () {
      var _sender = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee28(options) {
        return _regenerator().w(function (_context28) {
          while (1) switch (_context28.n) {
            case 0:
              return _context28.a(2, new Sender("mock-adapter-uuid"));
          }
        }, _callee28);
      }));
      function sender(_x11) {
        return _sender.apply(this, arguments);
      }
      return sender;
    }()
  }]);
}();
var sender = new Sender("mock-sender-uuid");
function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms || 1);
  });
}
var utils = {
  buildCQTag: function buildCQTag(type, params, prefix) {
    var paramStr = Object.entries(params).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];
      return "".concat(k, "=").concat(v);
    }).join(",");
    return "[CQ:".concat(type).concat(paramStr ? "," + paramStr : "", "]");
  },
  parseCQText: function parseCQText(text, prefix) {
    return [text];
  },
  image: function image(url) {
    return "[CQ:image,file=".concat(url, "]");
  },
  video: function video(url) {
    return "[CQ:video,file=".concat(url, "]");
  }
};
var consoleMock = {
  log: function log() {
    var _console;
    (_console = console).log.apply(_console, arguments);
  },
  info: function info() {
    var _console2;
    (_console2 = console).log.apply(_console2, arguments);
  },
  error: function error() {
    var _console3;
    (_console3 = console).error.apply(_console3, arguments);
  },
  debug: function debug() {
    var _console4;
    (_console4 = console).debug.apply(_console4, arguments);
  }
};
module.exports = {
  Adapter: Adapter,
  Bucket: Bucket,
  sender: sender,
  Sender: Sender,
  sleep: sleep,
  utils: utils,
  console: consoleMock,
  redisClient: redisClient
};

/***/ },

/***/ 581
(module, __unused_webpack_exports, __webpack_require__) {

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var moment = __webpack_require__(716),
  axios = __webpack_require__(938);
var _require = __webpack_require__(498),
  Adapter = _require.Adapter,
  Bucket = _require.Bucket,
  s = _require.sender,
  image = _require.utils.image;
var _require$utils = (__webpack_require__(567).utils),
  logger = _require$utils.logger,
  sleep = _require$utils.sleep,
  wait4Input = _require$utils.wait4Input,
  getQlClientWithMode = _require$utils.getQlClientWithMode,
  savePin2DB = _require$utils.savePin2DB,
  extractPin = _require$utils.extractPin,
  recallMsg = _require$utils.recallMsg,
  getBotAndMaster = _require$utils.getBotAndMaster;
module.exports = {
  rabbit: function () {
    var _rabbit = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
      var jd_cookie, rabbit_pro_addr, rabbit_pro_token, rabbit_pro_container_id, mck, wskey, scan, cmd, config, rabbit_ql_ck_sync, sync2PinDB, doPwdLogin;
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.n) {
          case 0:
            jd_cookie = new Bucket("jd_cookie");
            mck = /*#__PURE__*/function () {
              var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
                var _AutoCaptcha, SendSMS, phone, _VerifyCode, smsCode, pin;
                return _regenerator().w(function (_context4) {
                  while (1) switch (_context4.n) {
                    case 0:
                      _AutoCaptcha = /*#__PURE__*/function () {
                        var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(phone) {
                          var tryAgain,
                            captchaOptions,
                            _yield$axios,
                            statusCode,
                            body,
                            AutoCaptchaResult,
                            _args = arguments;
                          return _regenerator().w(function (_context) {
                            while (1) switch (_context.n) {
                              case 0:
                                tryAgain = _args.length > 1 && _args[1] !== undefined ? _args[1] : 0;
                                captchaOptions = {
                                  url: "".concat(rabbit_pro_addr, "/sms/AutoCaptcha"),
                                  //?BotApiToken=${rabbit_pro_token}
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json'
                                  },
                                  data: {
                                    Phone: phone
                                  },
                                  responseType: 'text'
                                };
                                logger.debug('AutoCaptcha params', captchaOptions);
                                _context.n = 1;
                                return axios(captchaOptions);
                              case 1:
                                _yield$axios = _context.v;
                                statusCode = _yield$axios.status;
                                body = _yield$axios.data;
                                if (!(statusCode !== 200)) {
                                  _context.n = 3;
                                  break;
                                }
                                _context.n = 2;
                                return s.reply("\u56FE\u5F62\u9A8C\u8BC1\u5931\u8D25\uFF0C\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458");
                              case 2:
                                process.exit(1);
                              case 3:
                                logger.debug('AutoCaptcha Result: ', body);
                                AutoCaptchaResult = JSON.parse(body);
                                if (!(AutoCaptchaResult.success && AutoCaptchaResult.code === 505 && AutoCaptchaResult.data.status === 505)) {
                                  _context.n = 4;
                                  break;
                                }
                                return _context.a(2, true);
                              case 4:
                                if (!(!AutoCaptchaResult.success && AutoCaptchaResult.code === 666 && AutoCaptchaResult.data.status === 666)) {
                                  _context.n = 9;
                                  break;
                                }
                                if (!(tryAgain > 0)) {
                                  _context.n = 6;
                                  break;
                                }
                                // await s.reply(`正在图形验证，请稍等...`)
                                logger.debug("".concat(phone, "\u6B63\u5728\u7B2C").concat(tryAgain, "\u56FE\u5F62\u9A8C\u8BC1\uFF0C\u8BF7\u7A0D\u7B49..."));
                                _context.n = 5;
                                return sleep(3000);
                              case 5:
                                return _context.a(2, _AutoCaptcha(phone, tryAgain - 1));
                              case 6:
                                _context.n = 7;
                                return s.reply("\u56FE\u5F62\u9A8C\u8BC1\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5");
                              case 7:
                                process.exit();
                              case 8:
                                _context.n = 11;
                                break;
                              case 9:
                                _context.n = 10;
                                return s.reply("\u56FE\u5F62\u9A8C\u8BC1\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5");
                              case 10:
                                process.exit();
                              case 11:
                                return _context.a(2);
                            }
                          }, _callee);
                        }));
                        return function AutoCaptcha(_x) {
                          return _ref2.apply(this, arguments);
                        };
                      }(); // 验证码发送
                      SendSMS = /*#__PURE__*/function () {
                        var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(Phone) {
                          var smsOptions, _yield$axios2, statusCode, body, SendSMSResult;
                          return _regenerator().w(function (_context2) {
                            while (1) switch (_context2.n) {
                              case 0:
                                smsOptions = {
                                  url: "".concat(rabbit_pro_addr, "/sms/sendSMS"),
                                  //?BotApiToken=${rabbit_pro_token}
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json'
                                  },
                                  data: {
                                    Phone: Phone,
                                    container_id: rabbit_pro_container_id
                                  },
                                  responseType: 'text'
                                };
                                logger.debug('SendSMS params', smsOptions);
                                _context2.n = 1;
                                return axios(smsOptions);
                              case 1:
                                _yield$axios2 = _context2.v;
                                statusCode = _yield$axios2.status;
                                body = _yield$axios2.data;
                                if (!(statusCode !== 200)) {
                                  _context2.n = 3;
                                  break;
                                }
                                _context2.n = 2;
                                return s.reply("\u9A8C\u8BC1\u7801\u53D1\u9001\u5931\u8D25\uFF0C\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458");
                              case 2:
                                process.exit();
                              case 3:
                                logger.debug('SendSMS body', body);
                                SendSMSResult = JSON.parse(body);
                                if (!(!SendSMSResult.success && SendSMSResult.code === 505 && SendSMSResult.data.status === 666)) {
                                  _context2.n = 5;
                                  break;
                                }
                                _context2.n = 4;
                                return _AutoCaptcha(Phone, 5);
                              case 4:
                                return _context2.a(2, _context2.v);
                              case 5:
                                if (SendSMSResult.success) {
                                  _context2.n = 7;
                                  break;
                                }
                                _context2.n = 6;
                                return s.reply("\u9A8C\u8BC1\u7801\u53D1\u9001\u5931\u8D25\u3002".concat(SendSMSResult && SendSMSResult.message ? "\u9519\u8BEF\u4FE1\u606F\uFF1A".concat(SendSMSResult.message) : '请联系管理员'));
                              case 6:
                                process.exit();
                              case 7:
                                return _context2.a(2);
                            }
                          }, _callee2);
                        }));
                        return function SendSMS(_x2) {
                          return _ref3.apply(this, arguments);
                        };
                      }();
                      _context4.n = 1;
                      return wait4Input("请输入手机号：", /^1\d{10}$/, {
                        delMsg: true
                      });
                    case 1:
                      phone = _context4.v;
                      _context4.n = 2;
                      return SendSMS(phone);
                    case 2:
                      // 验证码校验
                      _VerifyCode = /*#__PURE__*/function () {
                        var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(Phone, Code) {
                          var options, _yield$axios3, statusCode, body, VerifyCodeResult, QrCode, jpgURL, _smsCode, success;
                          return _regenerator().w(function (_context3) {
                            while (1) switch (_context3.n) {
                              case 0:
                                options = {
                                  url: "".concat(rabbit_pro_addr, "/sms/VerifyCode"),
                                  // ?BotApiToken=${rabbit_pro_token}
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json'
                                  },
                                  data: {
                                    Phone: Phone,
                                    Code: Code,
                                    container_id: rabbit_pro_container_id
                                  },
                                  responseType: 'text'
                                };
                                logger.debug('VerifyCode params', options);
                                _context3.n = 1;
                                return axios(options);
                              case 1:
                                _yield$axios3 = _context3.v;
                                statusCode = _yield$axios3.status;
                                body = _yield$axios3.data;
                                if (!(statusCode !== 200)) {
                                  _context3.n = 3;
                                  break;
                                }
                                _context3.n = 2;
                                return s.reply("\u9A8C\u8BC1\u7801\u6821\u9A8C\u5931\u8D25\uFF0C\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458");
                              case 2:
                                process.exit();
                              case 3:
                                logger.debug('VerifyCode body', body);
                                _context3.n = 4;
                                return JSON.parse(body);
                              case 4:
                                VerifyCodeResult = _context3.v;
                                if (!(VerifyCodeResult.code === 555 && VerifyCodeResult.data.status === 555)) {
                                  _context3.n = 7;
                                  break;
                                }
                                // 风险账户，需要二验
                                QrCode = "https://qr.m.jd.com/p?k=" + VerifyCodeResult.RiskQRCode;
                                _context3.n = 5;
                                return s.reply("请使用京东APP扫码, 并确认登录");
                              case 5:
                                jpgURL = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=".concat(QrCode);
                                _context3.n = 6;
                                return s.reply(image(jpgURL));
                              case 6:
                                process.exit();
                                _context3.n = 9;
                                break;
                              case 7:
                                if (!(VerifyCodeResult.code === 503 && VerifyCodeResult.data.status === 503)) {
                                  _context3.n = 9;
                                  break;
                                }
                                _context3.n = 8;
                                return wait4Input("验证码输入错误，请重新输入：", /^\d{6}$/, {
                                  delMsg: true
                                });
                              case 8:
                                _smsCode = _context3.v;
                                return _context3.a(2, _VerifyCode(Phone, _smsCode));
                              case 9:
                                success = VerifyCodeResult && VerifyCodeResult.success && VerifyCodeResult.pin;
                                if (success) {
                                  _context3.n = 11;
                                  break;
                                }
                                _context3.n = 10;
                                return s.reply("\u767B\u5F55\u5931\u8D25\u3002".concat(VerifyCodeResult && VerifyCodeResult.message ? "\u9519\u8BEF\u4FE1\u606F\uFF1A".concat(VerifyCodeResult.message) : '请联系管理员'));
                              case 10:
                                process.exit();
                              case 11:
                                return _context3.a(2, VerifyCodeResult.pin);
                            }
                          }, _callee3);
                        }));
                        return function VerifyCode(_x3, _x4) {
                          return _ref4.apply(this, arguments);
                        };
                      }();
                      _context4.n = 3;
                      return wait4Input("请输入验证码：", /^\d{6}$/, {
                        delMsg: true
                      });
                    case 3:
                      smsCode = _context4.v;
                      _context4.n = 4;
                      return _VerifyCode(phone, smsCode);
                    case 4:
                      pin = _context4.v;
                      _context4.n = 5;
                      return s.reply("\u3010".concat(pin, "\u3011\u767B\u5F55\u6210\u529F"));
                    case 5:
                      return _context4.a(2, pin);
                  }
                }, _callee4);
              }));
              return function mck() {
                return _ref.apply(this, arguments);
              };
            }();
            wskey = /*#__PURE__*/function () {
              var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
                return _regenerator().w(function (_context5) {
                  while (1) switch (_context5.n) {
                    case 0:
                      _context5.n = 1;
                      return s.reply("\u6682\u672A\u652F\u6301");
                    case 1:
                      return _context5.a(2);
                  }
                }, _callee5);
              }));
              return function wskey() {
                return _ref5.apply(this, arguments);
              };
            }();
            scan = /*#__PURE__*/function () {
              var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
                var isScan,
                  QrCheck,
                  BeanQrCode,
                  _args8 = arguments;
                return _regenerator().w(function (_context8) {
                  while (1) switch (_context8.n) {
                    case 0:
                      isScan = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : true;
                      logger.debug("scan");
                      QrCheck = /*#__PURE__*/function () {
                        var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(QRCodeKey) {
                          var QrCheckUrl, options, _yield$axios4, statusCode, body, QrCheckResult, pin;
                          return _regenerator().w(function (_context6) {
                            while (1) switch (_context6.n) {
                              case 0:
                                QrCheckUrl = rabbit_pro_addr + "/api/QrCheck";
                                options = {
                                  url: QrCheckUrl,
                                  method: "post",
                                  headers: {
                                    'Content-Type': 'application/json'
                                  },
                                  data: {
                                    token: rabbit_pro_token,
                                    container_id: rabbit_pro_container_id,
                                    QRCodeKey: QRCodeKey
                                  },
                                  responseType: 'text'
                                };
                                logger.debug('QrCheck params', options);
                                _context6.n = 1;
                                return axios(options);
                              case 1:
                                _yield$axios4 = _context6.v;
                                statusCode = _yield$axios4.status;
                                body = _yield$axios4.data;
                                if (!(statusCode !== 200)) {
                                  _context6.n = 3;
                                  break;
                                }
                                _context6.n = 2;
                                return s.reply("\u767B\u9646\u5931\u8D25");
                              case 2:
                                return _context6.a(2, -1);
                              case 3:
                                logger.debug('QrCheck Result: ', body);
                                QrCheckResult = JSON.parse(body);
                                if (!(QrCheckResult.code === 56)) {
                                  _context6.n = 4;
                                  break;
                                }
                                // 未扫码
                                logger.debug("\u672A\u626B\u7801\uFF0C\u7B49\u5F85\u626B\u7801...");
                                return _context6.a(2, false);
                              case 4:
                                if (!(QrCheckResult.code === 57)) {
                                  _context6.n = 5;
                                  break;
                                }
                                // 已扫码，未确认
                                logger.debug("\u5DF2\u626B\u7801\uFF0C\u7B49\u5F85\u786E\u8BA4...");
                                return _context6.a(2, false);
                              case 5:
                                if (!(QrCheckResult.code === 220)) {
                                  _context6.n = 7;
                                  break;
                                }
                                _context6.n = 6;
                                return s.reply("".concat(QrCheckResult.msg || '登陆失败，请换种方式'));
                              case 6:
                                return _context6.a(2, -1);
                              case 7:
                                if (!(QrCheckResult.code > 500)) {
                                  _context6.n = 9;
                                  break;
                                }
                                _context6.n = 8;
                                return s.reply("".concat(QrCheckResult.msg || '登陆失败，请换种方式'));
                              case 8:
                                return _context6.a(2, -2);
                              case 9:
                                pin = QrCheckResult.pin;
                                if (pin) {
                                  _context6.n = 11;
                                  break;
                                }
                                _context6.n = 10;
                                return s.reply('登陆失败，请确认是否是在二维码有效期内登陆。实在没办法就联系管理员吧');
                              case 10:
                                process.exit();
                              case 11:
                                _context6.n = 12;
                                return savePin2DB(pin);
                              case 12:
                                _context6.n = 13;
                                return s.reply("\u3010".concat(pin, "\u3011\u767B\u9646\u6210\u529F"));
                              case 13:
                                return _context6.a(2, pin);
                            }
                          }, _callee6);
                        }));
                        return function QrCheck(_x5) {
                          return _ref7.apply(this, arguments);
                        };
                      }();
                      BeanQrCode = /*#__PURE__*/function () {
                        var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
                          var BeanQrCodeURL, options, _yield$axios5, statusCode, body, data, QRCodeKey, QrCode, jpgURL, jcomond, success, num;
                          return _regenerator().w(function (_context7) {
                            while (1) switch (_context7.n) {
                              case 0:
                                BeanQrCodeURL = rabbit_pro_addr + "/api/GenQrCode";
                                options = {
                                  url: BeanQrCodeURL,
                                  method: "post",
                                  headers: {
                                    'Content-Type': 'application/json'
                                  },
                                  responseType: 'text'
                                };
                                logger.debug('BeanQrCode params', options);
                                _context7.n = 1;
                                return axios(options);
                              case 1:
                                _yield$axios5 = _context7.v;
                                statusCode = _yield$axios5.status;
                                body = _yield$axios5.data;
                                if (!(statusCode !== 200)) {
                                  _context7.n = 3;
                                  break;
                                }
                                _context7.n = 2;
                                return s.reply("\u83B7\u53D6\u4E8C\u7EF4\u7801\u5931\u8D25\u3002".concat(body));
                              case 2:
                                return _context7.a(2);
                              case 3:
                                logger.debug('BeanQrCode Result: ', body);
                                data = JSON.parse(body);
                                QRCodeKey = data.QRCodeKey;
                                if (!isScan) {
                                  _context7.n = 6;
                                  break;
                                }
                                QrCode = "https://qr.m.jd.com/p?k=" + QRCodeKey;
                                _context7.n = 4;
                                return s.reply("请使用京东APP扫码, 并确认登录");
                              case 4:
                                jpgURL = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=".concat(QrCode);
                                _context7.n = 5;
                                return s.reply(image(jpgURL));
                              case 5:
                                _context7.n = 7;
                                break;
                              case 6:
                                jcomond = data.jcommond;
                                _context7.n = 7;
                                return s.reply("\u8BF7\u590D\u5236\u672C\u6D88\u606F\u6253\u5F00\u4EAC\u4E1CAPP, \u5E76\u786E\u8BA4\u767B\u5F55\n".concat(jcomond));
                              case 7:
                                success = false, num = 1;
                              case 8:
                                if (success) {
                                  _context7.n = 12;
                                  break;
                                }
                                if (!(num > 15)) {
                                  _context7.n = 9;
                                  break;
                                }
                                logger.debug("\u8D85\u8FC7150\u79D2\uFF0C\u7ED3\u675F\u8F6E\u8BE2\u3002");
                                return _context7.a(3, 12);
                              case 9:
                                _context7.n = 10;
                                return sleep(10 * 1000);
                              case 10:
                                logger.debug("\u6B63\u5728\u7B2C".concat(++num, "\u6B21\u8F6E\u8BE2..."));
                                _context7.n = 11;
                                return QrCheck(QRCodeKey);
                              case 11:
                                success = _context7.v;
                                _context7.n = 8;
                                break;
                              case 12:
                                if (success) {
                                  _context7.n = 13;
                                  break;
                                }
                                _context7.n = 13;
                                return s.reply("\u767B\u9646\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
                              case 13:
                                return _context7.a(2, success);
                            }
                          }, _callee7);
                        }));
                        return function BeanQrCode() {
                          return _ref8.apply(this, arguments);
                        };
                      }();
                      _context8.n = 1;
                      return BeanQrCode();
                    case 1:
                      return _context8.a(2, _context8.v);
                  }
                }, _callee8);
              }));
              return function scan() {
                return _ref6.apply(this, arguments);
              };
            }();
            cmd = /*#__PURE__*/function () {
              var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
                return _regenerator().w(function (_context9) {
                  while (1) switch (_context9.n) {
                    case 0:
                      _context9.n = 1;
                      return scan(false);
                    case 1:
                      return _context9.a(2, _context9.v);
                  }
                }, _callee9);
              }));
              return function cmd() {
                return _ref9.apply(this, arguments);
              };
            }();
            config = /*#__PURE__*/function () {
              var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
                var _configResult$data;
                var configUrl, options, _yield$axios6, statusCode, body, configResult, list, container_id, found, _container_id, container;
                return _regenerator().w(function (_context0) {
                  while (1) switch (_context0.n) {
                    case 0:
                      configUrl = rabbit_pro_addr + "/api/Config";
                      options = {
                        url: configUrl,
                        method: "get",
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        responseType: 'text'
                      };
                      _context0.n = 1;
                      return axios(options);
                    case 1:
                      _yield$axios6 = _context0.v;
                      statusCode = _yield$axios6.status;
                      body = _yield$axios6.data;
                      if (!(statusCode !== 200)) {
                        _context0.n = 3;
                        break;
                      }
                      _context0.n = 2;
                      return s.reply("\u83B7\u53D6\uD83D\uDC30\u914D\u7F6E\u5931\u8D25\u3002");
                    case 2:
                      process.exit();
                    case 3:
                      logger.debug('Config Result: ', body);
                      configResult = JSON.parse(body);
                      list = configResult === null || configResult === void 0 || (_configResult$data = configResult.data) === null || _configResult$data === void 0 ? void 0 : _configResult$data.list;
                      if (!(!list || list.length === 0)) {
                        _context0.n = 5;
                        break;
                      }
                      _context0.n = 4;
                      return s.reply("\u8BF7\u5148\u53BB\uD83D\uDC30\u6DFB\u52A0\u5BB9\u5668");
                    case 4:
                      process.exit();
                      _context0.n = 12;
                      break;
                    case 5:
                      if (!(list.length === 1)) {
                        _context0.n = 7;
                        break;
                      }
                      container_id = list[0].container_id;
                      _context0.n = 6;
                      return jd_cookie.set("rabbit_pro_container_id", container_id);
                    case 6:
                      _context0.n = 12;
                      break;
                    case 7:
                      // 多个容器，检查已配置的容器是否存在
                      found = !!rabbit_pro_container_id && list.find(function (item) {
                        return item.container_id === parseInt(rabbit_pro_container_id);
                      });
                      if (!found) {
                        _context0.n = 8;
                        break;
                      }
                      return _context0.a(2, rabbit_pro_container_id);
                    case 8:
                      _context0.n = 9;
                      return wait4Input("\u672A\u67E5\u627E\u5230\u5BB9\u5668\uFF0C\u8BF7\u8F93\u5165\u5BB9\u5668ID\uFF1A\n".concat(list.map(function (item) {
                        return "".concat(item === null || item === void 0 ? void 0 : item.container_id, "\uFF1A").concat(item === null || item === void 0 ? void 0 : item.container_name);
                      }).join('\n')), /^\d+$/, '容器ID必须为数字');
                    case 9:
                      _container_id = _context0.v;
                      container = list.find(function (item) {
                        return item.container_id === parseInt(_container_id);
                      });
                      if (container) {
                        _context0.n = 10;
                        break;
                      }
                      _context0.n = 10;
                      return s.reply("\u5BB9\u5668ID\u4E0D\u5B58\u5728");
                    case 10:
                      if (!container) {
                        _context0.n = 8;
                        break;
                      }
                    case 11:
                      _context0.n = 12;
                      return jd_cookie.set("rabbit_pro_container_id", _container_id);
                    case 12:
                      return _context0.a(2, container_id);
                  }
                }, _callee0);
              }));
              return function config() {
                return _ref0.apply(this, arguments);
              };
            }();
            /**
             * 同步ck到青龙
             * @returns {Promise<void>}
             */
            rabbit_ql_ck_sync = /*#__PURE__*/function () {
              var _ref1 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
                var jd_cookie, baseUrl, name, passwd, _yield$axios7, result, access_token, configUrl, options;
                return _regenerator().w(function (_context1) {
                  while (1) switch (_context1.n) {
                    case 0:
                      if (rabbit_pro_container_id) {
                        _context1.n = 2;
                        break;
                      }
                      _context1.n = 1;
                      return s.reply("\u8BF7\u5148\u53BB\uD83D\uDC30\u6DFB\u52A0\u5BB9\u5668");
                    case 1:
                      return _context1.a(2);
                    case 2:
                      jd_cookie = new Bucket("jd_cookie");
                      _context1.n = 3;
                      return jd_cookie.get("rabbit_pro_addr");
                    case 3:
                      baseUrl = _context1.v;
                      _context1.n = 4;
                      return jd_cookie.get("rabbit_pro_username");
                    case 4:
                      name = _context1.v;
                      _context1.n = 5;
                      return jd_cookie.get("rabbit_pro_password");
                    case 5:
                      passwd = _context1.v;
                      if (!(!baseUrl || !name || !passwd)) {
                        _context1.n = 6;
                        break;
                      }
                      logger.debug("\u53C2\u6570\u914D\u7F6E\u4E0D\u5BF9");
                      return _context1.a(2);
                    case 6:
                      _context1.n = 7;
                      return axios({
                        method: "post",
                        url: baseUrl + "/admin/auth",
                        data: {
                          username: name,
                          password: passwd
                        },
                        responseType: "json"
                      });
                    case 7:
                      _yield$axios7 = _context1.v;
                      result = _yield$axios7.data;
                      logger.debug("auth result: ".concat(JSON.stringify(result)));
                      if (result) {
                        _context1.n = 8;
                        break;
                      }
                      return _context1.a(2);
                    case 8:
                      if (!(result.code === 401)) {
                        _context1.n = 9;
                        break;
                      }
                      return _context1.a(2);
                    case 9:
                      access_token = result.access_token;
                      configUrl = rabbit_pro_addr + "/container/sync_all";
                      options = {
                        url: configUrl,
                        method: "post",
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: "Bearer ".concat(access_token)
                        },
                        data: {
                          id: rabbit_pro_container_id
                        }
                      };
                      _context1.n = 10;
                      return axios(options);
                    case 10:
                      return _context1.a(2);
                  }
                }, _callee1);
              }));
              return function rabbit_ql_ck_sync() {
                return _ref1.apply(this, arguments);
              };
            }();
            sync2PinDB = /*#__PURE__*/function () {
              var _ref10 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(pin) {
                var sync, botConfig, adapter, _t, _t2;
                return _regenerator().w(function (_context10) {
                  while (1) switch (_context10.p = _context10.n) {
                    case 0:
                      if (pin) {
                        _context10.n = 1;
                        break;
                      }
                      logger.warn("\u672A\u8FD4\u56DEpin\uFF0C\u767B\u5F55\u5931\u8D25");
                      return _context10.a(2);
                    case 1:
                      _context10.n = 2;
                      return savePin2DB(pin);
                    case 2:
                      _context10.n = 3;
                      return jd_cookie.get("rabbit_pro_sync", false);
                    case 3:
                      sync = _context10.v;
                      logger.debug("rabbit_pro_sync: [".concat(sync, "]"));
                      if (sync) {
                        _context10.n = 4;
                        break;
                      }
                      return _context10.a(2);
                    case 4:
                      _context10.p = 4;
                      _context10.n = 5;
                      return sleep();
                    case 5:
                      _context10.n = 6;
                      return getBotAndMaster();
                    case 6:
                      botConfig = _context10.v;
                      if (!(botConfig !== null && botConfig !== void 0 && botConfig.admin && botConfig !== null && botConfig !== void 0 && botConfig.bot_id && botConfig !== null && botConfig !== void 0 && botConfig.platform)) {
                        _context10.n = 7;
                        break;
                      }
                      adapter = new Adapter(botConfig);
                      _t = adapter;
                      if (!_t) {
                        _context10.n = 7;
                        break;
                      }
                      _context10.n = 7;
                      return adapter.receive({
                        user_id: botConfig.admin,
                        content: "同步ck"
                      });
                    case 7:
                      _context10.n = 9;
                      break;
                    case 8:
                      _context10.p = 8;
                      _t2 = _context10.v;
                      logger.error("\u540C\u6B65\u5931\u8D25: ".concat(_t2.message));
                    case 9:
                      return _context10.a(2);
                  }
                }, _callee10, null, [[4, 8]]);
              }));
              return function sync2PinDB(_x6) {
                return _ref10.apply(this, arguments);
              };
            }();
            doPwdLogin = /*#__PURE__*/function () {
              var _ref11 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
                var _require2, pwdLogin, riskVerifyCode, phone, pwd, _yield$pwdLogin, success, code, message, pin, jpgURL, msg, smsCode, riskVerifyCodeRes;
                return _regenerator().w(function (_context11) {
                  while (1) switch (_context11.n) {
                    case 0:
                      _require2 = __webpack_require__(362), pwdLogin = _require2.pwdLogin, riskVerifyCode = _require2.riskVerifyCode;
                      _context11.n = 1;
                      return wait4Input("请输入手机号：", /^1\d{10}$/, {
                        delMsg: true
                      });
                    case 1:
                      phone = _context11.v;
                      _context11.n = 2;
                      return wait4Input("请输入密码：", /^\S{4}$/, {
                        delMsg: true
                      });
                    case 2:
                      pwd = _context11.v;
                      _context11.n = 3;
                      return pwdLogin(rabbit_pro_addr, rabbit_pro_token, phone, pwd);
                    case 3:
                      _yield$pwdLogin = _context11.v;
                      success = _yield$pwdLogin.success;
                      code = _yield$pwdLogin.code;
                      message = _yield$pwdLogin.message;
                      pin = _yield$pwdLogin.pin;
                      jpgURL = _yield$pwdLogin.jpgURL;
                      if (!jpgURL) {
                        _context11.n = 6;
                        break;
                      }
                      _context11.n = 4;
                      return s.reply("\u8D26\u53F7\u5B58\u5728\u98CE\u9669\uFF0C\u8BF7\u626B\u7801\u786E\u8BA4\u767B\u5F55");
                    case 4:
                      _context11.n = 5;
                      return s.reply(image(jpgURL));
                    case 5:
                      process.exit();
                      _context11.n = 11;
                      break;
                    case 6:
                      if (!(code === 601 || code === 602)) {
                        _context11.n = 9;
                        break;
                      }
                      // 风险账户，需要二验
                      msg = code === 601 ? "需要短信验证" : "需要语音验证";
                      _context11.n = 7;
                      return wait4Input("\u6B63\u5728\u8FDB\u884C\u4E8C\u6B21\u9A8C\u8BC1\uFF0C".concat(msg, ":"), /^\d{6}$/, {
                        delMsg: true
                      });
                    case 7:
                      smsCode = _context11.v;
                      _context11.n = 8;
                      return riskVerifyCode(rabbit_pro_addr, phone, smsCode, rabbit_pro_token);
                    case 8:
                      riskVerifyCodeRes = _context11.v;
                      logger.debug("riskVerifyCodeRes: ".concat(JSON.stringify(riskVerifyCodeRes)));
                      pin = riskVerifyCodeRes === null || riskVerifyCodeRes === void 0 ? void 0 : riskVerifyCodeRes.pin;
                      message = riskVerifyCodeRes === null || riskVerifyCodeRes === void 0 ? void 0 : riskVerifyCodeRes.message;
                      _context11.n = 11;
                      break;
                    case 9:
                      if (success) {
                        _context11.n = 11;
                        break;
                      }
                      _context11.n = 10;
                      return s.reply("\u767B\u5F55\u5931\u8D25\u3002".concat(message));
                    case 10:
                      process.exit();
                    case 11:
                      if (!pin) {
                        _context11.n = 15;
                        break;
                      }
                      _context11.n = 12;
                      return sync2PinDB(pin);
                    case 12:
                      _context11.n = 13;
                      return rabbit_ql_ck_sync();
                    case 13:
                      _context11.n = 14;
                      return s.reply("".concat(pin, " ").concat(message || '登录成功~'));
                    case 14:
                      return _context11.a(2);
                    case 15:
                      _context11.n = 16;
                      return s.reply("\u767B\u5F55\u5931\u8D25\u3002".concat(message));
                    case 16:
                      return _context11.a(2);
                  }
                }, _callee11);
              }));
              return function doPwdLogin() {
                return _ref11.apply(this, arguments);
              };
            }();
            _context13.n = 1;
            return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
              var messages, content, pin, ckArr, ck, reply_id, ql, envs, found, _envs, _found$, _found$2, id, _found$3, name, value, remarks, _t3, _t4, _t5, _t6, _t7, _t8, _t9;
              return _regenerator().w(function (_context12) {
                while (1) switch (_context12.n) {
                  case 0:
                    _context12.n = 1;
                    return jd_cookie.get("rabbit_pro_addr");
                  case 1:
                    rabbit_pro_addr = _context12.v;
                    _context12.n = 2;
                    return jd_cookie.get("rabbit_pro_token");
                  case 2:
                    rabbit_pro_token = _context12.v;
                    _context12.n = 3;
                    return jd_cookie.get("rabbit_pro_container_id");
                  case 3:
                    rabbit_pro_container_id = _context12.v;
                    messages = [];
                    if (!rabbit_pro_addr) {
                      messages.push('对接地址为空  请先对接  指令: set jd_cookie rabbit_pro_addr http://123.123.123.123:5701');
                    }
                    if (!rabbit_pro_token) {
                      messages.push("\u5BF9\u63A5token\u4E3A\u7A7A  \u8BF7\u5148\u5BF9\u63A5  \u6307\u4EE4: set jd_cookie rabbit_pro_token xxx");
                    }
                    if (!(messages.length > 0)) {
                      _context12.n = 5;
                      break;
                    }
                    _context12.n = 4;
                    return s.reply(messages.join('\n'));
                  case 4:
                    process.exit();
                  case 5:
                    if (rabbit_pro_addr[rabbit_pro_addr.length - 1] === '/') {
                      rabbit_pro_addr = rabbit_pro_addr.substring(0, rabbit_pro_addr.length - 1);
                    }
                    _context12.n = 6;
                    return s.getContent();
                  case 6:
                    content = _context12.v;
                    if (!(content.indexOf("账号密码") > -1 || content.indexOf("账密") > -1)) {
                      _context12.n = 8;
                      break;
                    }
                    _context12.n = 7;
                    return doPwdLogin();
                  case 7:
                    return _context12.a(2);
                  case 8:
                    _context12.n = 9;
                    return config();
                  case 9:
                    rabbit_pro_container_id = _context12.v;
                    if (!(content.startsWith('网页') || content.startsWith('mad') || content === '登陆' || content === '登录')) {
                      _context12.n = 11;
                      break;
                    }
                    _context12.n = 10;
                    return mck();
                  case 10:
                    pin = _context12.v;
                    _context12.n = 40;
                    break;
                  case 11:
                    if (!content.startsWith('应用')) {
                      _context12.n = 13;
                      break;
                    }
                    _context12.n = 12;
                    return wskey();
                  case 12:
                    pin = _context12.v;
                    _context12.n = 40;
                    break;
                  case 13:
                    if (!content.startsWith('扫码')) {
                      _context12.n = 15;
                      break;
                    }
                    _context12.n = 14;
                    return scan();
                  case 14:
                    pin = _context12.v;
                    _context12.n = 40;
                    break;
                  case 15:
                    if (!content.startsWith('口令')) {
                      _context12.n = 17;
                      break;
                    }
                    _context12.n = 16;
                    return cmd();
                  case 16:
                    pin = _context12.v;
                    _context12.n = 40;
                    break;
                  case 17:
                    if (!(content.includes("pt_key=") && content.includes("pt_pin="))) {
                      _context12.n = 39;
                      break;
                    }
                    ckArr = [];
                    content.split(";").forEach(function (ck) {
                      if (ck.includes("pt_key=") || ck.includes("pt_pin=")) {
                        var kv = ck.split("=");
                        ckArr.push("".concat(kv[0].trim(), "=").concat(kv[1].trim()));
                      }
                    });
                    ck = ckArr.join(";") + ";";
                    logger.debug("ck: ".concat(ck));
                    if (ck) {
                      _context12.n = 19;
                      break;
                    }
                    _context12.n = 18;
                    return s.reply("\u672A\u63D0\u53D6\u5230ck\uFF0C\u8BF7\u91CD\u65B0\u53D1\u9001");
                  case 18:
                    return _context12.a(2);
                  case 19:
                    // save 2 qinglong
                    pin = extractPin(ck);
                    if (pin) {
                      _context12.n = 21;
                      break;
                    }
                    _context12.n = 20;
                    return s.reply("\u672A\u63D0\u53D6\u5230pin\uFF0C\u8BF7\u91CD\u65B0\u53D1\u9001");
                  case 20:
                    return _context12.a(2);
                  case 21:
                    logger.debug("pin: ".concat(pin));
                    if (!(content.startsWith("提取") || content.startsWith("tq"))) {
                      _context12.n = 25;
                      break;
                    }
                    _context12.n = 22;
                    return s.reply(ck);
                  case 22:
                    reply_id = _context12.v;
                    _t3 = recallMsg;
                    _t4 = reply_id;
                    _context12.n = 23;
                    return s.getMessageId();
                  case 23:
                    _t5 = _context12.v;
                    _context12.n = 24;
                    return _t3([_t4, _t5]);
                  case 24:
                    return _context12.a(2);
                  case 25:
                    _context12.n = 26;
                    return getQlClientWithMode(0, 0);
                  case 26:
                    ql = _context12.v[0];
                    _context12.n = 27;
                    return ql.GetEnvs();
                  case 27:
                    envs = _context12.v;
                    found = envs.filter(function (e) {
                      return e.value.indexOf(pin) > -1;
                    });
                    if (!(found.length === 0)) {
                      _context12.n = 29;
                      break;
                    }
                    _envs = [{
                      name: "JD_COOKIE",
                      value: ck,
                      remarks: "".concat(pin, "@@").concat(moment().valueOf())
                    }];
                    _context12.n = 28;
                    return ql.AddEnvs(_envs);
                  case 28:
                    _context12.n = 35;
                    break;
                  case 29:
                    id = ((_found$ = found[0]) === null || _found$ === void 0 ? void 0 : _found$.id) || ((_found$2 = found[0]) === null || _found$2 === void 0 ? void 0 : _found$2._id);
                    _found$3 = found[0], name = _found$3.name, value = _found$3.value, remarks = _found$3.remarks;
                    if (!(value === ck)) {
                      _context12.n = 33;
                      break;
                    }
                    _t6 = recallMsg;
                    _context12.n = 30;
                    return s.getMessageId();
                  case 30:
                    _t7 = _context12.v;
                    _context12.n = 31;
                    return _t6([_t7]);
                  case 31:
                    _context12.n = 32;
                    return s.reply("\u6B64ck\u5DF2\u5B58\u5728\uFF0C\u65E0\u9700\u91CD\u590D\u6DFB\u52A0");
                  case 32:
                    return _context12.a(2);
                  case 33:
                    _context12.n = 34;
                    return ql.UpdateEnv(id, name, ck, remarks);
                  case 34:
                    _context12.n = 35;
                    return ql.EnableEnvs([id]);
                  case 35:
                    _context12.n = 36;
                    return s.reply("\u3010".concat(pin, "\u3011\u767B\u5F55\u6210\u529F"));
                  case 36:
                    _t8 = recallMsg;
                    _context12.n = 37;
                    return s.getMessageId();
                  case 37:
                    _t9 = _context12.v;
                    _context12.n = 38;
                    return _t8([_t9]);
                  case 38:
                    _context12.n = 40;
                    break;
                  case 39:
                    return _context12.a(2);
                  case 40:
                    _context12.n = 41;
                    return sync2PinDB(pin);
                  case 41:
                    return _context12.a(2);
                }
              }, _callee12);
            }))();
          case 1:
            return _context13.a(2);
        }
      }, _callee13);
    }));
    function rabbit() {
      return _rabbit.apply(this, arguments);
    }
    return rabbit;
  }()
};

/***/ },

/***/ 362
(module, __unused_webpack_exports, __webpack_require__) {

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var crypto = __webpack_require__(982),
  axios = __webpack_require__(938),
  fs = __webpack_require__(896),
  path = __webpack_require__(928);
var _require$utils = (__webpack_require__(567).utils),
  logger = _require$utils.logger,
  sleep = _require$utils.sleep;

/**
 * AES-GCM 加密密码
 * @param {string} pwd 密码
 * @param {string} account 账户
 * @returns {string} 加密后的密码
 */
function encryptPwdAesGcm(pwd, account) {
  var secret = "#(*():dfgjn^%&89$%#";
  var md5Bytes = crypto.createHash('sha512').update(secret + account + secret).digest();
  var key = md5Bytes.slice(0, 32);
  var nonce = crypto.randomBytes(12);
  var cipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
  var paddedPwd = Buffer.concat([crypto.randomBytes(16), Buffer.from(pwd), crypto.randomBytes(16)]);
  var ciphertext = Buffer.concat([cipher.update(paddedPwd), cipher["final"]()]);
  var tag = cipher.getAuthTag();
  return Buffer.concat([tag, ciphertext, nonce]).toString('base64');
}

/**
 * 初始化
 * @param {string} url URL
 * @param {string} account 账户
 * @param {string} botApiToken API Token
 */
function init(_x, _x2, _x3) {
  return _init.apply(this, arguments);
}
/**
 * 自动图形验证
 * @param {string} url URL
 * @param {string} account 账户
 * @param {string} botApiToken API Token
 */
function _init() {
  _init = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(url, account, botApiToken) {
    var response;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _context.n = 1;
          return axios.post("".concat(url, "/bot/pwd/init"), {
            account: account
          }, {
            params: {
              BotApiToken: botApiToken
            }
          });
        case 1:
          response = _context.v;
          return _context.a(2, response.data);
      }
    }, _callee);
  }));
  return _init.apply(this, arguments);
}
function autoCaptcha(_x4, _x5, _x6) {
  return _autoCaptcha.apply(this, arguments);
}
/**
 * 登录
 * @param {string} url URL
 * @param {string} account 账户
 * @param {string} pwd 密码
 * @param {string} botApiToken API Token
 */
function _autoCaptcha() {
  _autoCaptcha = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(url, account, botApiToken) {
    var response;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.n = 1;
          return axios.post("".concat(url, "/bot/pwd/auto_captcha"), {
            account: account
          }, {
            params: {
              BotApiToken: botApiToken
            }
          });
        case 1:
          response = _context2.v;
          return _context2.a(2, response.data);
      }
    }, _callee2);
  }));
  return _autoCaptcha.apply(this, arguments);
}
function login(_x7, _x8, _x9, _x0) {
  return _login.apply(this, arguments);
}
/**
 * 二次验证-发送验证码
 * @param {string} url URL
 * @param {string} account 账户
 * @param {string} botApiToken API Token
 */
function _login() {
  _login = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(url, account, pwd, botApiToken) {
    var encryptedPwd, response;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          encryptedPwd = encryptPwdAesGcm(pwd, account);
          _context3.n = 1;
          return axios.post("".concat(url, "/bot/pwd/login"), {
            account: account,
            pwd: encryptedPwd
          }, {
            params: {
              BotApiToken: botApiToken
            }
          });
        case 1:
          response = _context3.v;
          return _context3.a(2, response.data);
      }
    }, _callee3);
  }));
  return _login.apply(this, arguments);
}
function riskSend(_x1, _x10, _x11) {
  return _riskSend.apply(this, arguments);
}
/**
 * 二次验证-核验验证码
 * @param {string} url URL
 * @param {string} account 账户
 * @param {string} code 6位数验证码
 * @param {string} botApiToken API Token
 */
function _riskSend() {
  _riskSend = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(url, account, botApiToken) {
    var response;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.n = 1;
          return axios.post("".concat(url, "/bot/risk/risk_send"), {
            account: account
          }, {
            params: {
              BotApiToken: botApiToken
            }
          });
        case 1:
          response = _context4.v;
          return _context4.a(2, response.data);
      }
    }, _callee4);
  }));
  return _riskSend.apply(this, arguments);
}
function riskVerifyCode(_x12, _x13, _x14, _x15) {
  return _riskVerifyCode.apply(this, arguments);
}
function _riskVerifyCode() {
  _riskVerifyCode = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(url, account, code, botApiToken) {
    var response;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          _context5.n = 1;
          return axios.post("".concat(url, "/bot/risk/risk_verify_code"), {
            account: account,
            code: code
          }, {
            params: {
              BotApiToken: botApiToken
            }
          });
        case 1:
          response = _context5.v;
          return _context5.a(2, response.data);
      }
    }, _callee5);
  }));
  return _riskVerifyCode.apply(this, arguments);
}
function writeToJpg(_x16) {
  return _writeToJpg.apply(this, arguments);
}
/**
 * 自动图形验证
 * @param rabbitUrl
 * @param account
 * @param botApiToken
 * @returns {Promise<{success: boolean, stage: string, code, message}|{success: boolean, stage: string, code, captchaCode, message}|{success: boolean, stage: string, code: number, message: string}>}
 */
function _writeToJpg() {
  _writeToJpg = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(url) {
    var paths, response;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          paths = path.join(process.cwd(), "public/".concat(crypto.randomUUID().split('-').join('') + '.jpg')); // 使用 axios 获取文件流
          _context6.n = 1;
          return axios({
            method: 'get',
            url: url,
            responseType: 'stream' // 设置响应类型为流
          });
        case 1:
          response = _context6.v;
          return _context6.a(2, new Promise(function (resolve, reject) {
            var writer = fs.createWriteStream(paths);

            // 响应流.pipe到文件
            response.data.pipe(writer);
            writer.on('finish', function () {
              resolve(paths); // 完成后返回文件路径
            });
            writer.on('error', function (err) {
              reject(err); // 错误时拒绝 Promise
            });
          }));
      }
    }, _callee6);
  }));
  return _writeToJpg.apply(this, arguments);
}
function doAutoCaptcha(_x17, _x18, _x19) {
  return _doAutoCaptcha.apply(this, arguments);
}
/**
 * 主函数
 * @param {string} rabbitUrl Rabbit URL
 * @param {string} botApiToken API Token
 * @param {string} account 账户
 * @param {string} pwd 密码
 * @returns {Promise<void>}
 * {
 *    success: boolean,
 *    stage: 'init/captcha/login'
 *    code: number,
 *    captchaCode: number,
 *    message: string,
 * }
 */
function _doAutoCaptcha() {
  _doAutoCaptcha = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(rabbitUrl, account, botApiToken) {
    var maxRetry, i, captchaRes;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          maxRetry = 5;
          i = 0;
        case 1:
          if (!(i < maxRetry)) {
            _context7.n = 8;
            break;
          }
          _context7.n = 2;
          return autoCaptcha(rabbitUrl, account, botApiToken);
        case 2:
          captchaRes = _context7.v;
          logger.debug('captchaRes', captchaRes);
          if (!captchaRes.success) {
            _context7.n = 3;
            break;
          }
          return _context7.a(2, {
            success: true,
            stage: 'captcha',
            code: captchaRes.data.status,
            message: captchaRes.message
          });
        case 3:
          if (!(captchaRes.data.status === 505)) {
            _context7.n = 4;
            break;
          }
          return _context7.a(2, {
            success: false,
            stage: 'captcha',
            code: initRes.code,
            captchaCode: captchaRes.data.status,
            message: captchaRes.message
          });
        case 4:
          if (!(captchaRes.data.status === 666)) {
            _context7.n = 6;
            break;
          }
          _context7.n = 5;
          return sleep();
        case 5:
          _context7.n = 7;
          break;
        case 6:
          return _context7.a(2, {
            success: false,
            stage: 'captcha',
            code: initRes.code,
            captchaCode: captchaRes.data.status,
            message: captchaRes.message
          });
        case 7:
          i++;
          _context7.n = 1;
          break;
        case 8:
          return _context7.a(2, {
            success: false,
            stage: 'captcha',
            code: 500,
            message: "\u9A8C\u8BC1\u6B21\u6570\u5DF2\u8FBE\u6700\u5927".concat(maxRetry, "\u6B21")
          });
      }
    }, _callee7);
  }));
  return _doAutoCaptcha.apply(this, arguments);
}
function main(_x20, _x21, _x22, _x23) {
  return _main.apply(this, arguments);
}
function _main() {
  _main = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(rabbitUrl, botApiToken, account, pwd) {
    var _initRes, captchaRes, loginRes, RiskUrl, jpgURL, _RiskUrl, RiskQRCode, risk_type, message, riskSendRes, _captchaRes, _t;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          _context8.n = 1;
          return init(rabbitUrl, account, botApiToken);
        case 1:
          _initRes = _context8.v;
          logger.debug('initRes', _initRes);
          if (_initRes.success) {
            _context8.n = 6;
            break;
          }
          if (!(_initRes.code === 505)) {
            _context8.n = 2;
            break;
          }
          return _context8.a(2, {
            success: false,
            stage: 'init',
            code: 505,
            message: _initRes.message
          });
        case 2:
          if (!(_initRes.code === 666)) {
            _context8.n = 5;
            break;
          }
          _context8.n = 3;
          return doAutoCaptcha(rabbitUrl, account, botApiToken);
        case 3:
          captchaRes = _context8.v;
          if (captchaRes.success) {
            _context8.n = 4;
            break;
          }
          return _context8.a(2, {
            success: captchaRes.success,
            stage: 'captcha',
            code: captchaRes.code,
            captchaCode: captchaRes.captchaCode,
            message: captchaRes.message
          });
        case 4:
          _context8.n = 6;
          break;
        case 5:
          return _context8.a(2, {
            success: false,
            stage: 'init',
            code: _initRes.code,
            message: _initRes.message
          });
        case 6:
          _context8.n = 7;
          return login(rabbitUrl, account, pwd, botApiToken);
        case 7:
          loginRes = _context8.v;
          logger.debug('loginRes', loginRes);
          if (loginRes.success) {
            _context8.n = 16;
            break;
          }
          if (!(loginRes.code === 505)) {
            _context8.n = 8;
            break;
          }
          return _context8.a(2, {
            success: loginRes.success,
            stage: 'login',
            code: 505,
            message: loginRes.message
          });
        case 8:
          if (!(loginRes.code === 555)) {
            _context8.n = 9;
            break;
          }
          RiskUrl = loginRes.RiskUrl; // const QrCode = "https://qr.m.jd.com/p?k=" + RiskQRCode
          jpgURL = "https://api.qrserver.com/v1/create-qr-code/?size=300*300&data=".concat(RiskUrl);
          return _context8.a(2, {
            success: loginRes.success,
            stage: 'login',
            code: 555,
            message: loginRes.message,
            jpgURL: jpgURL
          });
        case 9:
          if (!(loginRes.code === 503)) {
            _context8.n = 10;
            break;
          }
          return _context8.a(2, {
            success: loginRes.success,
            stage: 'login',
            code: 503,
            message: loginRes.message
          });
        case 10:
          if (!(loginRes.code === 601 || loginRes.code === 602)) {
            _context8.n = 14;
            break;
          }
          // 需要短信二次验证
          _RiskUrl = loginRes.RiskUrl, RiskQRCode = loginRes.RiskQRCode, risk_type = loginRes.risk_type, message = loginRes.message;
          if (!(risk_type === 'sms' || risk_type === 'voice')) {
            _context8.n = 13;
            break;
          }
          _context8.n = 11;
          return riskSend(rabbitUrl, account, botApiToken);
        case 11:
          riskSendRes = _context8.v;
          logger.debug('riskSendRes', riskSendRes);

          // 需要滑块验证
          if (!(riskSendRes.code === 666)) {
            _context8.n = 13;
            break;
          }
          _context8.n = 12;
          return doAutoCaptcha(rabbitUrl, account, botApiToken);
        case 12:
          _captchaRes = _context8.v;
          if (_captchaRes.success) {
            _context8.n = 13;
            break;
          }
          return _context8.a(2, _captchaRes);
        case 13:
          return _context8.a(2, {
            success: loginRes.success,
            stage: 'login',
            code: loginRes.code,
            message: loginRes.message
          });
        case 14:
          return _context8.a(2, {
            success: loginRes.success,
            stage: 'login',
            code: loginRes.code,
            message: loginRes.message
          });
        case 15:
          _context8.n = 17;
          break;
        case 16:
          return _context8.a(2, {
            success: loginRes.success,
            stage: 'login',
            code: loginRes === null || loginRes === void 0 ? void 0 : loginRes.code,
            message: loginRes === null || loginRes === void 0 ? void 0 : loginRes.message,
            pin: loginRes === null || loginRes === void 0 ? void 0 : loginRes.pin,
            ck: loginRes === null || loginRes === void 0 ? void 0 : loginRes.ck
          });
        case 17:
          _context8.n = 19;
          break;
        case 18:
          _context8.p = 18;
          _t = _context8.v;
          logger.error("Error:", _t.message);
          return _context8.a(2, {
            success: false,
            code: 500,
            message: _t.message
          });
        case 19:
          return _context8.a(2);
      }
    }, _callee8, null, [[0, 18]]);
  }));
  return _main.apply(this, arguments);
}
module.exports = {
  pwdLogin: main,
  riskVerifyCode: riskVerifyCode
};

/***/ },

/***/ 396
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpsProxyAgent = void 0;
const net = __importStar(__webpack_require__(278));
const tls = __importStar(__webpack_require__(756));
const assert_1 = __importDefault(__webpack_require__(770));
const debug_1 = __importDefault(__webpack_require__(263));
const agent_base_1 = __webpack_require__(953);
const url_1 = __webpack_require__(16);
const parse_proxy_response_1 = __webpack_require__(584);
const debug = (0, debug_1.default)('https-proxy-agent');
const setServernameFromNonIpHost = (options) => {
    if (options.servername === undefined &&
        options.host &&
        !net.isIP(options.host)) {
        return {
            ...options,
            servername: options.host,
        };
    }
    return options;
};
/**
 * The `HttpsProxyAgent` implements an HTTP Agent subclass that connects to
 * the specified "HTTP(s) proxy server" in order to proxy HTTPS requests.
 *
 * Outgoing HTTP requests are first tunneled through the proxy server using the
 * `CONNECT` HTTP request method to establish a connection to the proxy server,
 * and then the proxy server connects to the destination target and issues the
 * HTTP request from the proxy server.
 *
 * `https:` requests have their socket connection upgraded to TLS once
 * the connection to the proxy server has been established.
 */
class HttpsProxyAgent extends agent_base_1.Agent {
    constructor(proxy, opts) {
        super(opts);
        this.options = { path: undefined };
        this.proxy = typeof proxy === 'string' ? new url_1.URL(proxy) : proxy;
        this.proxyHeaders = opts?.headers ?? {};
        debug('Creating new HttpsProxyAgent instance: %o', this.proxy.href);
        // Trim off the brackets from IPv6 addresses
        const host = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, '');
        const port = this.proxy.port
            ? parseInt(this.proxy.port, 10)
            : this.proxy.protocol === 'https:'
                ? 443
                : 80;
        this.connectOpts = {
            // Attempt to negotiate http/1.1 for proxy servers that support http/2
            ALPNProtocols: ['http/1.1'],
            ...(opts ? omit(opts, 'headers') : null),
            host,
            port,
        };
    }
    /**
     * Called when the node-core HTTP client library is creating a
     * new HTTP request.
     */
    async connect(req, opts) {
        const { proxy } = this;
        if (!opts.host) {
            throw new TypeError('No "host" provided');
        }
        // Create a socket connection to the proxy server.
        let socket;
        if (proxy.protocol === 'https:') {
            debug('Creating `tls.Socket`: %o', this.connectOpts);
            socket = tls.connect(setServernameFromNonIpHost(this.connectOpts));
        }
        else {
            debug('Creating `net.Socket`: %o', this.connectOpts);
            socket = net.connect(this.connectOpts);
        }
        const headers = typeof this.proxyHeaders === 'function'
            ? this.proxyHeaders()
            : { ...this.proxyHeaders };
        const host = net.isIPv6(opts.host) ? `[${opts.host}]` : opts.host;
        let payload = `CONNECT ${host}:${opts.port} HTTP/1.1\r\n`;
        // Inject the `Proxy-Authorization` header if necessary.
        if (proxy.username || proxy.password) {
            const auth = `${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`;
            headers['Proxy-Authorization'] = `Basic ${Buffer.from(auth).toString('base64')}`;
        }
        headers.Host = `${host}:${opts.port}`;
        if (!headers['Proxy-Connection']) {
            headers['Proxy-Connection'] = this.keepAlive
                ? 'Keep-Alive'
                : 'close';
        }
        for (const name of Object.keys(headers)) {
            payload += `${name}: ${headers[name]}\r\n`;
        }
        const proxyResponsePromise = (0, parse_proxy_response_1.parseProxyResponse)(socket);
        socket.write(`${payload}\r\n`);
        const { connect, buffered } = await proxyResponsePromise;
        req.emit('proxyConnect', connect);
        this.emit('proxyConnect', connect, req);
        if (connect.statusCode === 200) {
            req.once('socket', resume);
            if (opts.secureEndpoint) {
                // The proxy is connecting to a TLS server, so upgrade
                // this socket connection to a TLS connection.
                debug('Upgrading socket connection to TLS');
                return tls.connect({
                    ...omit(setServernameFromNonIpHost(opts), 'host', 'path', 'port'),
                    socket,
                });
            }
            return socket;
        }
        // Some other status code that's not 200... need to re-play the HTTP
        // header "data" events onto the socket once the HTTP machinery is
        // attached so that the node core `http` can parse and handle the
        // error status code.
        // Close the original socket, and a new "fake" socket is returned
        // instead, so that the proxy doesn't get the HTTP request
        // written to it (which may contain `Authorization` headers or other
        // sensitive data).
        //
        // See: https://hackerone.com/reports/541502
        socket.destroy();
        const fakeSocket = new net.Socket({ writable: false });
        fakeSocket.readable = true;
        // Need to wait for the "socket" event to re-play the "data" events.
        req.once('socket', (s) => {
            debug('Replaying proxy buffer for failed request');
            (0, assert_1.default)(s.listenerCount('data') > 0);
            // Replay the "buffered" Buffer onto the fake `socket`, since at
            // this point the HTTP module machinery has been hooked up for
            // the user.
            s.push(buffered);
            s.push(null);
        });
        return fakeSocket;
    }
}
HttpsProxyAgent.protocols = ['http', 'https'];
exports.HttpsProxyAgent = HttpsProxyAgent;
function resume(socket) {
    socket.resume();
}
function omit(obj, ...keys) {
    const ret = {};
    let key;
    for (key in obj) {
        if (!keys.includes(key)) {
            ret[key] = obj[key];
        }
    }
    return ret;
}
//# sourceMappingURL=index.js.map

/***/ },

/***/ 584
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseProxyResponse = void 0;
const debug_1 = __importDefault(__webpack_require__(263));
const debug = (0, debug_1.default)('https-proxy-agent:parse-proxy-response');
function parseProxyResponse(socket) {
    return new Promise((resolve, reject) => {
        // we need to buffer any HTTP traffic that happens with the proxy before we get
        // the CONNECT response, so that if the response is anything other than an "200"
        // response code, then we can re-play the "data" events on the socket once the
        // HTTP parser is hooked up...
        let buffersLength = 0;
        const buffers = [];
        function read() {
            const b = socket.read();
            if (b)
                ondata(b);
            else
                socket.once('readable', read);
        }
        function cleanup() {
            socket.removeListener('end', onend);
            socket.removeListener('error', onerror);
            socket.removeListener('readable', read);
        }
        function onend() {
            cleanup();
            debug('onend');
            reject(new Error('Proxy connection ended before receiving CONNECT response'));
        }
        function onerror(err) {
            cleanup();
            debug('onerror %o', err);
            reject(err);
        }
        function ondata(b) {
            buffers.push(b);
            buffersLength += b.length;
            const buffered = Buffer.concat(buffers, buffersLength);
            const endOfHeaders = buffered.indexOf('\r\n\r\n');
            if (endOfHeaders === -1) {
                // keep buffering
                debug('have not received end of HTTP headers yet...');
                read();
                return;
            }
            const headerParts = buffered
                .slice(0, endOfHeaders)
                .toString('ascii')
                .split('\r\n');
            const firstLine = headerParts.shift();
            if (!firstLine) {
                socket.destroy();
                return reject(new Error('No header received from proxy CONNECT response'));
            }
            const firstLineParts = firstLine.split(' ');
            const statusCode = +firstLineParts[1];
            const statusText = firstLineParts.slice(2).join(' ');
            const headers = {};
            for (const header of headerParts) {
                if (!header)
                    continue;
                const firstColon = header.indexOf(':');
                if (firstColon === -1) {
                    socket.destroy();
                    return reject(new Error(`Invalid header from proxy CONNECT response: "${header}"`));
                }
                const key = header.slice(0, firstColon).toLowerCase();
                const value = header.slice(firstColon + 1).trimStart();
                const current = headers[key];
                if (typeof current === 'string') {
                    headers[key] = [current, value];
                }
                else if (Array.isArray(current)) {
                    current.push(value);
                }
                else {
                    headers[key] = value;
                }
            }
            debug('got proxy server response: %o %o', firstLine, headers);
            cleanup();
            resolve({
                connect: {
                    statusCode,
                    statusText,
                    headers,
                },
                buffered,
            });
        }
        socket.on('error', onerror);
        socket.on('end', onend);
        read();
    });
}
exports.parseProxyResponse = parseProxyResponse;
//# sourceMappingURL=parse-proxy-response.js.map

/***/ },

/***/ 770
(module) {

"use strict";
module.exports = require("assert");

/***/ },

/***/ 938
(module) {

"use strict";
module.exports = require("axios");

/***/ },

/***/ 263
(module) {

"use strict";
module.exports = require("debug");

/***/ },

/***/ 659
(module) {

"use strict";
module.exports = require("ioredis");

/***/ },

/***/ 716
(module) {

"use strict";
module.exports = require("moment");

/***/ },

/***/ 982
(module) {

"use strict";
module.exports = require("crypto");

/***/ },

/***/ 896
(module) {

"use strict";
module.exports = require("fs");

/***/ },

/***/ 611
(module) {

"use strict";
module.exports = require("http");

/***/ },

/***/ 692
(module) {

"use strict";
module.exports = require("https");

/***/ },

/***/ 278
(module) {

"use strict";
module.exports = require("net");

/***/ },

/***/ 928
(module) {

"use strict";
module.exports = require("path");

/***/ },

/***/ 756
(module) {

"use strict";
module.exports = require("tls");

/***/ },

/***/ 16
(module) {

"use strict";
module.exports = require("url");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(581);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;