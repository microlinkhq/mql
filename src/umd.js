!(function (t, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define(e)
    : ((t = t || self).mql = e())
})(this, function () {
  'use strict'
  function t (e) {
    return (t =
      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
        ? function (t) {
            return typeof t
          }
        : function (t) {
            return t &&
              'function' == typeof Symbol &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? 'symbol'
              : typeof t
          })(e)
  }
  function e (t, e, r, n, o, a, i) {
    try {
      var s = t[a](i),
        u = s.value
    } catch (t) {
      return void r(t)
    }
    s.done ? e(u) : Promise.resolve(u).then(n, o)
  }
  function r (t) {
    return function () {
      var r = this,
        n = arguments
      return new Promise(function (o, a) {
        var i = t.apply(r, n)
        function s (t) {
          e(i, o, a, s, u, 'next', t)
        }
        function u (t) {
          e(i, o, a, s, u, 'throw', t)
        }
        s(void 0)
      })
    }
  }
  function n (t, e) {
    if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
  }
  function o (t, e) {
    for (var r = 0; r < e.length; r++) {
      var n = e[r]
      ;(n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        'value' in n && (n.writable = !0),
        Object.defineProperty(t, n.key, n)
    }
  }
  function a (t, e, r) {
    return (
      e in t
        ? Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 })
        : (t[e] = r),
      t
    )
  }
  function i (t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = null != arguments[e] ? arguments[e] : {},
        n = Object.keys(r)
      'function' == typeof Object.getOwnPropertySymbols &&
        (n = n.concat(
          Object.getOwnPropertySymbols(r).filter(function (t) {
            return Object.getOwnPropertyDescriptor(r, t).enumerable
          })
        )),
        n.forEach(function (e) {
          a(t, e, r[e])
        })
    }
    return t
  }
  function s (t, e) {
    if ('function' != typeof e && null !== e)
      throw new TypeError('Super expression must either be null or a function')
    ;(t.prototype = Object.create(e && e.prototype, {
      constructor: { value: t, writable: !0, configurable: !0 }
    })),
      e && c(t, e)
  }
  function u (t) {
    return (u = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t)
        })(t)
  }
  function c (t, e) {
    return (c =
      Object.setPrototypeOf ||
      function (t, e) {
        return (t.__proto__ = e), t
      })(t, e)
  }
  function h (t, e, r) {
    return (h = (function () {
      if ('undefined' == typeof Reflect || !Reflect.construct) return !1
      if (Reflect.construct.sham) return !1
      if ('function' == typeof Proxy) return !0
      try {
        return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0
      } catch (t) {
        return !1
      }
    })()
      ? Reflect.construct
      : function (t, e, r) {
          var n = [null]
          n.push.apply(n, e)
          var o = new (Function.bind.apply(t, n))()
          return r && c(o, r.prototype), o
        }).apply(null, arguments)
  }
  function f (t) {
    var e = 'function' == typeof Map ? new Map() : void 0
    return (f = function (t) {
      if (null === t || ((r = t), -1 === Function.toString.call(r).indexOf('[native code]')))
        return t
      var r
      if ('function' != typeof t)
        throw new TypeError('Super expression must either be null or a function')
      if (void 0 !== e) {
        if (e.has(t)) return e.get(t)
        e.set(t, n)
      }
      function n () {
        return h(t, arguments, u(this).constructor)
      }
      return (
        (n.prototype = Object.create(t.prototype, {
          constructor: { value: n, enumerable: !1, writable: !0, configurable: !0 }
        })),
        c(n, t)
      )
    })(t)
  }
  function l (t, e) {
    if (null == t) return {}
    var r,
      n,
      o = (function (t, e) {
        if (null == t) return {}
        var r,
          n,
          o = {},
          a = Object.keys(t)
        for (n = 0; n < a.length; n++) (r = a[n]), e.indexOf(r) >= 0 || (o[r] = t[r])
        return o
      })(t, e)
    if (Object.getOwnPropertySymbols) {
      var a = Object.getOwnPropertySymbols(t)
      for (n = 0; n < a.length; n++)
        (r = a[n]),
          e.indexOf(r) >= 0 || (Object.prototype.propertyIsEnumerable.call(t, r) && (o[r] = t[r]))
    }
    return o
  }
  function p (t, e) {
    return !e || ('object' != typeof e && 'function' != typeof e)
      ? (function (t) {
          if (void 0 === t)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
          return t
        })(t)
      : e
  }
  function y (t, e) {
    return (
      (function (t) {
        if (Array.isArray(t)) return t
      })(t) ||
      (function (t, e) {
        var r = [],
          n = !0,
          o = !1,
          a = void 0
        try {
          for (
            var i, s = t[Symbol.iterator]();
            !(n = (i = s.next()).done) && (r.push(i.value), !e || r.length !== e);
            n = !0
          );
        } catch (t) {
          ;(o = !0), (a = t)
        } finally {
          try {
            n || null == s.return || s.return()
          } finally {
            if (o) throw a
          }
        }
        return r
      })(t, e) ||
      (function () {
        throw new TypeError('Invalid attempt to destructure non-iterable instance')
      })()
    )
  }
  function v (t) {
    return (
      (function (t) {
        if (Array.isArray(t)) {
          for (var e = 0, r = new Array(t.length); e < t.length; e++) r[e] = t[e]
          return r
        }
      })(t) ||
      (function (t) {
        if (
          Symbol.iterator in Object(t) ||
          '[object Arguments]' === Object.prototype.toString.call(t)
        )
          return Array.from(t)
      })(t) ||
      (function () {
        throw new TypeError('Invalid attempt to spread non-iterable instance')
      })()
    )
  }
  var m,
    d = ((function (e) {
      !(function (r) {
        var n,
          o = Object.prototype,
          a = o.hasOwnProperty,
          i = 'function' == typeof Symbol ? Symbol : {},
          s = i.iterator || '@@iterator',
          u = i.asyncIterator || '@@asyncIterator',
          c = i.toStringTag || '@@toStringTag',
          h = r.regeneratorRuntime
        if (h) e.exports = h
        else {
          ;(h = r.regeneratorRuntime = e.exports).wrap = w
          var f = 'suspendedStart',
            l = 'suspendedYield',
            p = 'executing',
            y = 'completed',
            v = {},
            m = {}
          m[s] = function () {
            return this
          }
          var d = Object.getPrototypeOf,
            b = d && d(d(P([])))
          b && b !== o && a.call(b, s) && (m = b)
          var g = (_.prototype = j.prototype = Object.create(m))
          ;(O.prototype = g.constructor = _),
            (_.constructor = O),
            (_[c] = O.displayName = 'GeneratorFunction'),
            (h.isGeneratorFunction = function (t) {
              var e = 'function' == typeof t && t.constructor
              return !!e && (e === O || 'GeneratorFunction' === (e.displayName || e.name))
            }),
            (h.mark = function (t) {
              return (
                Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, _)
                  : ((t.__proto__ = _), c in t || (t[c] = 'GeneratorFunction')),
                (t.prototype = Object.create(g)),
                t
              )
            }),
            (h.awrap = function (t) {
              return { __await: t }
            }),
            k(A.prototype),
            (A.prototype[u] = function () {
              return this
            }),
            (h.AsyncIterator = A),
            (h.async = function (t, e, r, n) {
              var o = new A(w(t, e, r, n))
              return h.isGeneratorFunction(e)
                ? o
                : o.next().then(function (t) {
                    return t.done ? t.value : o.next()
                  })
            }),
            k(g),
            (g[c] = 'Generator'),
            (g[s] = function () {
              return this
            }),
            (g.toString = function () {
              return '[object Generator]'
            }),
            (h.keys = function (t) {
              var e = []
              for (var r in t) e.push(r)
              return (
                e.reverse(),
                function r () {
                  for (; e.length; ) {
                    var n = e.pop()
                    if (n in t) return (r.value = n), (r.done = !1), r
                  }
                  return (r.done = !0), r
                }
              )
            }),
            (h.values = P),
            (C.prototype = {
              constructor: C,
              reset: function (t) {
                if (
                  ((this.prev = 0),
                  (this.next = 0),
                  (this.sent = this._sent = n),
                  (this.done = !1),
                  (this.delegate = null),
                  (this.method = 'next'),
                  (this.arg = n),
                  this.tryEntries.forEach(S),
                  !t)
                )
                  for (var e in this)
                    't' === e.charAt(0) && a.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = n)
              },
              stop: function () {
                this.done = !0
                var t = this.tryEntries[0].completion
                if ('throw' === t.type) throw t.arg
                return this.rval
              },
              dispatchException: function (t) {
                if (this.done) throw t
                var e = this
                function r (r, o) {
                  return (
                    (s.type = 'throw'),
                    (s.arg = t),
                    (e.next = r),
                    o && ((e.method = 'next'), (e.arg = n)),
                    !!o
                  )
                }
                for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                  var i = this.tryEntries[o],
                    s = i.completion
                  if ('root' === i.tryLoc) return r('end')
                  if (i.tryLoc <= this.prev) {
                    var u = a.call(i, 'catchLoc'),
                      c = a.call(i, 'finallyLoc')
                    if (u && c) {
                      if (this.prev < i.catchLoc) return r(i.catchLoc, !0)
                      if (this.prev < i.finallyLoc) return r(i.finallyLoc)
                    } else if (u) {
                      if (this.prev < i.catchLoc) return r(i.catchLoc, !0)
                    } else {
                      if (!c) throw new Error('try statement without catch or finally')
                      if (this.prev < i.finallyLoc) return r(i.finallyLoc)
                    }
                  }
                }
              },
              abrupt: function (t, e) {
                for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                  var n = this.tryEntries[r]
                  if (
                    n.tryLoc <= this.prev &&
                    a.call(n, 'finallyLoc') &&
                    this.prev < n.finallyLoc
                  ) {
                    var o = n
                    break
                  }
                }
                o &&
                  ('break' === t || 'continue' === t) &&
                  o.tryLoc <= e &&
                  e <= o.finallyLoc &&
                  (o = null)
                var i = o ? o.completion : {}
                return (
                  (i.type = t),
                  (i.arg = e),
                  o ? ((this.method = 'next'), (this.next = o.finallyLoc), v) : this.complete(i)
                )
              },
              complete: function (t, e) {
                if ('throw' === t.type) throw t.arg
                return (
                  'break' === t.type || 'continue' === t.type
                    ? (this.next = t.arg)
                    : 'return' === t.type
                    ? ((this.rval = this.arg = t.arg),
                      (this.method = 'return'),
                      (this.next = 'end'))
                    : 'normal' === t.type && e && (this.next = e),
                  v
                )
              },
              finish: function (t) {
                for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                  var r = this.tryEntries[e]
                  if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), S(r), v
                }
              },
              catch: function (t) {
                for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                  var r = this.tryEntries[e]
                  if (r.tryLoc === t) {
                    var n = r.completion
                    if ('throw' === n.type) {
                      var o = n.arg
                      S(r)
                    }
                    return o
                  }
                }
                throw new Error('illegal catch attempt')
              },
              delegateYield: function (t, e, r) {
                return (
                  (this.delegate = { iterator: P(t), resultName: e, nextLoc: r }),
                  'next' === this.method && (this.arg = n),
                  v
                )
              }
            })
        }
        function w (t, e, r, n) {
          var o = e && e.prototype instanceof j ? e : j,
            a = Object.create(o.prototype),
            i = new C(n || [])
          return (
            (a._invoke = (function (t, e, r) {
              var n = f
              return function (o, a) {
                if (n === p) throw new Error('Generator is already running')
                if (n === y) {
                  if ('throw' === o) throw a
                  return L()
                }
                for (r.method = o, r.arg = a; ; ) {
                  var i = r.delegate
                  if (i) {
                    var s = E(i, r)
                    if (s) {
                      if (s === v) continue
                      return s
                    }
                  }
                  if ('next' === r.method) r.sent = r._sent = r.arg
                  else if ('throw' === r.method) {
                    if (n === f) throw ((n = y), r.arg)
                    r.dispatchException(r.arg)
                  } else 'return' === r.method && r.abrupt('return', r.arg)
                  n = p
                  var u = x(t, e, r)
                  if ('normal' === u.type) {
                    if (((n = r.done ? y : l), u.arg === v)) continue
                    return { value: u.arg, done: r.done }
                  }
                  'throw' === u.type && ((n = y), (r.method = 'throw'), (r.arg = u.arg))
                }
              }
            })(t, r, i)),
            a
          )
        }
        function x (t, e, r) {
          try {
            return { type: 'normal', arg: t.call(e, r) }
          } catch (t) {
            return { type: 'throw', arg: t }
          }
        }
        function j () {}
        function O () {}
        function _ () {}
        function k (t) {
          ;['next', 'throw', 'return'].forEach(function (e) {
            t[e] = function (t) {
              return this._invoke(e, t)
            }
          })
        }
        function A (e) {
          var r
          this._invoke = function (n, o) {
            function i () {
              return new Promise(function (r, i) {
                !(function r (n, o, i, s) {
                  var u = x(e[n], e, o)
                  if ('throw' !== u.type) {
                    var c = u.arg,
                      h = c.value
                    return h && 'object' === t(h) && a.call(h, '__await')
                      ? Promise.resolve(h.__await).then(
                          function (t) {
                            r('next', t, i, s)
                          },
                          function (t) {
                            r('throw', t, i, s)
                          }
                        )
                      : Promise.resolve(h).then(
                          function (t) {
                            ;(c.value = t), i(c)
                          },
                          function (t) {
                            return r('throw', t, i, s)
                          }
                        )
                  }
                  s(u.arg)
                })(n, o, r, i)
              })
            }
            return (r = r ? r.then(i, i) : i())
          }
        }
        function E (t, e) {
          var r = t.iterator[e.method]
          if (r === n) {
            if (((e.delegate = null), 'throw' === e.method)) {
              if (
                t.iterator.return &&
                ((e.method = 'return'), (e.arg = n), E(t, e), 'throw' === e.method)
              )
                return v
              ;(e.method = 'throw'),
                (e.arg = new TypeError("The iterator does not provide a 'throw' method"))
            }
            return v
          }
          var o = x(r, t.iterator, e.arg)
          if ('throw' === o.type)
            return (e.method = 'throw'), (e.arg = o.arg), (e.delegate = null), v
          var a = o.arg
          return a
            ? a.done
              ? ((e[t.resultName] = a.value),
                (e.next = t.nextLoc),
                'return' !== e.method && ((e.method = 'next'), (e.arg = n)),
                (e.delegate = null),
                v)
              : a
            : ((e.method = 'throw'),
              (e.arg = new TypeError('iterator result is not an object')),
              (e.delegate = null),
              v)
        }
        function R (t) {
          var e = { tryLoc: t[0] }
          1 in t && (e.catchLoc = t[1]),
            2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
            this.tryEntries.push(e)
        }
        function S (t) {
          var e = t.completion || {}
          ;(e.type = 'normal'), delete e.arg, (t.completion = e)
        }
        function C (t) {
          ;(this.tryEntries = [{ tryLoc: 'root' }]), t.forEach(R, this), this.reset(!0)
        }
        function P (t) {
          if (t) {
            var e = t[s]
            if (e) return e.call(t)
            if ('function' == typeof t.next) return t
            if (!isNaN(t.length)) {
              var r = -1,
                o = function e () {
                  for (; ++r < t.length; )
                    if (a.call(t, r)) return (e.value = t[r]), (e.done = !1), e
                  return (e.value = n), (e.done = !0), e
                }
              return (o.next = o)
            }
          }
          return { next: L }
        }
        function L () {
          return { value: n, done: !0 }
        }
      })(
        (function () {
          return this || ('object' === ('undefined' == typeof self ? 'undefined' : t(self)) && self)
        })() || Function('return this')()
      )
    })((m = { exports: {} }), m.exports),
    m.exports),
    b =
      (function () {
        return this || ('object' === ('undefined' == typeof self ? 'undefined' : t(self)) && self)
      })() || Function('return this')(),
    g = b.regeneratorRuntime && Object.getOwnPropertyNames(b).indexOf('regeneratorRuntime') >= 0,
    w = g && b.regeneratorRuntime
  b.regeneratorRuntime = void 0
  var x = d
  if (g) b.regeneratorRuntime = w
  else
    try {
      delete b.regeneratorRuntime
    } catch (t) {
      b.regeneratorRuntime = void 0
    }
  var j = x,
    O = Object.prototype.hasOwnProperty,
    _ = (function () {
      for (var t = [], e = 0; e < 256; ++e)
        t.push('%' + ((e < 16 ? '0' : '') + e.toString(16)).toUpperCase())
      return t
    })(),
    k = function (t, e) {
      for (var r = e && e.plainObjects ? Object.create(null) : {}, n = 0; n < t.length; ++n)
        void 0 !== t[n] && (r[n] = t[n])
      return r
    },
    A = {
      arrayToObject: k,
      assign: function (t, e) {
        return Object.keys(e).reduce(function (t, r) {
          return (t[r] = e[r]), t
        }, t)
      },
      combine: function (t, e) {
        return [].concat(t, e)
      },
      compact: function (e) {
        for (var r = [{ obj: { o: e }, prop: 'o' }], n = [], o = 0; o < r.length; ++o)
          for (var a = r[o], i = a.obj[a.prop], s = Object.keys(i), u = 0; u < s.length; ++u) {
            var c = s[u],
              h = i[c]
            'object' === t(h) &&
              null !== h &&
              -1 === n.indexOf(h) &&
              (r.push({ obj: i, prop: c }), n.push(h))
          }
        return (
          (function (t) {
            for (; t.length > 1; ) {
              var e = t.pop(),
                r = e.obj[e.prop]
              if (Array.isArray(r)) {
                for (var n = [], o = 0; o < r.length; ++o) void 0 !== r[o] && n.push(r[o])
                e.obj[e.prop] = n
              }
            }
          })(r),
          e
        )
      },
      decode: function (t, e, r) {
        var n = t.replace(/\+/g, ' ')
        if ('iso-8859-1' === r) return n.replace(/%[0-9a-f]{2}/gi, unescape)
        try {
          return decodeURIComponent(n)
        } catch (t) {
          return n
        }
      },
      encode: function (t, e, r) {
        if (0 === t.length) return t
        var n = 'string' == typeof t ? t : String(t)
        if ('iso-8859-1' === r)
          return escape(n).replace(/%u[0-9a-f]{4}/gi, function (t) {
            return '%26%23' + parseInt(t.slice(2), 16) + '%3B'
          })
        for (var o = '', a = 0; a < n.length; ++a) {
          var i = n.charCodeAt(a)
          45 === i ||
          46 === i ||
          95 === i ||
          126 === i ||
          (i >= 48 && i <= 57) ||
          (i >= 65 && i <= 90) ||
          (i >= 97 && i <= 122)
            ? (o += n.charAt(a))
            : i < 128
            ? (o += _[i])
            : i < 2048
            ? (o += _[192 | (i >> 6)] + _[128 | (63 & i)])
            : i < 55296 || i >= 57344
            ? (o += _[224 | (i >> 12)] + _[128 | ((i >> 6) & 63)] + _[128 | (63 & i)])
            : ((a += 1),
              (i = 65536 + (((1023 & i) << 10) | (1023 & n.charCodeAt(a)))),
              (o +=
                _[240 | (i >> 18)] +
                _[128 | ((i >> 12) & 63)] +
                _[128 | ((i >> 6) & 63)] +
                _[128 | (63 & i)]))
        }
        return o
      },
      isBuffer: function (t) {
        return null != t && !!(t.constructor && t.constructor.isBuffer && t.constructor.isBuffer(t))
      },
      isRegExp: function (t) {
        return '[object RegExp]' === Object.prototype.toString.call(t)
      },
      merge: function e (r, n, o) {
        if (!n) return r
        if ('object' !== t(n)) {
          if (Array.isArray(r)) r.push(n)
          else {
            if ('object' !== t(r)) return [r, n]
            ;((o && (o.plainObjects || o.allowPrototypes)) || !O.call(Object.prototype, n)) &&
              (r[n] = !0)
          }
          return r
        }
        if ('object' !== t(r)) return [r].concat(n)
        var a = r
        return (
          Array.isArray(r) && !Array.isArray(n) && (a = k(r, o)),
          Array.isArray(r) && Array.isArray(n)
            ? (n.forEach(function (n, a) {
                O.call(r, a)
                  ? r[a] && 'object' === t(r[a])
                    ? (r[a] = e(r[a], n, o))
                    : r.push(n)
                  : (r[a] = n)
              }),
              r)
            : Object.keys(n).reduce(function (t, r) {
                var a = n[r]
                return O.call(t, r) ? (t[r] = e(t[r], a, o)) : (t[r] = a), t
              }, a)
        )
      }
    },
    E = String.prototype.replace,
    R = /%20/g,
    S = {
      default: 'RFC3986',
      formatters: {
        RFC1738: function (t) {
          return E.call(t, R, '+')
        },
        RFC3986: function (t) {
          return t
        }
      },
      RFC1738: 'RFC1738',
      RFC3986: 'RFC3986'
    },
    C = {
      brackets: function (t) {
        return t + '[]'
      },
      indices: function (t, e) {
        return t + '[' + e + ']'
      },
      repeat: function (t) {
        return t
      }
    },
    P = Array.isArray,
    L = Array.prototype.push,
    U = function (t, e) {
      L.apply(t, P(e) ? e : [e])
    },
    T = Date.prototype.toISOString,
    N = {
      addQueryPrefix: !1,
      allowDots: !1,
      charset: 'utf-8',
      charsetSentinel: !1,
      delimiter: '&',
      encode: !0,
      encoder: A.encode,
      encodeValuesOnly: !1,
      indices: !1,
      serializeDate: function (t) {
        return T.call(t)
      },
      skipNulls: !1,
      strictNullHandling: !1
    },
    q = function t (e, r, n, o, a, i, s, u, c, h, f, l, p) {
      var y = e
      if (('function' == typeof s ? (y = s(r, y)) : y instanceof Date && (y = h(y)), null === y)) {
        if (o) return i && !l ? i(r, N.encoder, p) : r
        y = ''
      }
      if ('string' == typeof y || 'number' == typeof y || 'boolean' == typeof y || A.isBuffer(y))
        return i
          ? [f(l ? r : i(r, N.encoder, p)) + '=' + f(i(y, N.encoder, p))]
          : [f(r) + '=' + f(String(y))]
      var v,
        m = []
      if (void 0 === y) return m
      if (Array.isArray(s)) v = s
      else {
        var d = Object.keys(y)
        v = u ? d.sort(u) : d
      }
      for (var b = 0; b < v.length; ++b) {
        var g = v[b]
        ;(a && null === y[g]) ||
          (Array.isArray(y)
            ? U(m, t(y[g], n(r, g), n, o, a, i, s, u, c, h, f, l, p))
            : U(m, t(y[g], r + (c ? '.' + g : '[' + g + ']'), n, o, a, i, s, u, c, h, f, l, p)))
      }
      return m
    },
    I = (Object.prototype.hasOwnProperty,
    function (e, r) {
      var n = e,
        o = r ? A.assign({}, r) : {}
      if (null !== o.encoder && void 0 !== o.encoder && 'function' != typeof o.encoder)
        throw new TypeError('Encoder has to be a function.')
      var a = void 0 === o.delimiter ? N.delimiter : o.delimiter,
        i = 'boolean' == typeof o.strictNullHandling ? o.strictNullHandling : N.strictNullHandling,
        s = 'boolean' == typeof o.skipNulls ? o.skipNulls : N.skipNulls,
        u = 'boolean' == typeof o.encode ? o.encode : N.encode,
        c = 'function' == typeof o.encoder ? o.encoder : N.encoder,
        h = 'function' == typeof o.sort ? o.sort : null,
        f = void 0 === o.allowDots ? N.allowDots : !!o.allowDots,
        l = 'function' == typeof o.serializeDate ? o.serializeDate : N.serializeDate,
        p = 'boolean' == typeof o.encodeValuesOnly ? o.encodeValuesOnly : N.encodeValuesOnly,
        y = o.charset || N.charset
      if (void 0 !== o.charset && 'utf-8' !== o.charset && 'iso-8859-1' !== o.charset)
        throw new Error('The charset option must be either utf-8, iso-8859-1, or undefined')
      if (void 0 === o.format) o.format = S.default
      else if (!Object.prototype.hasOwnProperty.call(S.formatters, o.format))
        throw new TypeError('Unknown format option provided.')
      var v,
        m,
        d = S.formatters[o.format]
      'function' == typeof o.filter
        ? (n = (m = o.filter)('', n))
        : Array.isArray(o.filter) && (v = m = o.filter)
      var b,
        g = []
      if ('object' !== t(n) || null === n) return ''
      b =
        o.arrayFormat in C
          ? o.arrayFormat
          : 'indices' in o
          ? o.indices
            ? 'indices'
            : 'repeat'
          : 'indices'
      var w = C[b]
      v || (v = Object.keys(n)), h && v.sort(h)
      for (var x = 0; x < v.length; ++x) {
        var j = v[x]
        ;(s && null === n[j]) || U(g, q(n[j], j, w, i, s, u ? c : null, m, h, f, l, d, p, y))
      }
      var O = g.join(a),
        _ = !0 === o.addQueryPrefix ? '?' : ''
      return (
        o.charsetSentinel && (_ += 'iso-8859-1' === y ? 'utf8=%26%2310003%3B&' : 'utf8=%E2%9C%93&'),
        O.length > 0 ? _ + O : ''
      )
    }),
    F = 2147483647,
    D = 36,
    H = 1,
    z = 26,
    G = 38,
    B = 700,
    M = 72,
    V = 128,
    $ = '-',
    K = /[^\x20-\x7E]/,
    Q = /[\x2E\u3002\uFF0E\uFF61]/g,
    W = {
      overflow: 'Overflow: input needs wider integers to process',
      'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
      'invalid-input': 'Invalid input'
    },
    Y = D - H,
    Z = Math.floor,
    J = String.fromCharCode
  function X (t) {
    throw new RangeError(W[t])
  }
  function tt (t, e) {
    return t + 22 + 75 * (t < 26) - ((0 != e) << 5)
  }
  function et (t, e, r) {
    var n = 0
    for (t = r ? Z(t / B) : t >> 1, t += Z(t / e); t > (Y * z) >> 1; n += D) t = Z(t / Y)
    return Z(n + ((Y + 1) * t) / (t + G))
  }
  function rt (t) {
    return (function (t, e) {
      var r = t.split('@'),
        n = ''
      r.length > 1 && ((n = r[0] + '@'), (t = r[1]))
      var o = (function (t, e) {
        for (var r = t.length, n = []; r--; ) n[r] = e(t[r])
        return n
      })((t = t.replace(Q, '.')).split('.'), e).join('.')
      return n + o
    })(t, function (t) {
      return K.test(t)
        ? 'xn--' +
            (function (t) {
              var e,
                r,
                n,
                o,
                a,
                i,
                s,
                u,
                c,
                h,
                f,
                l,
                p,
                y,
                v,
                m = []
              for (
                l = (t = (function (t) {
                  for (var e, r, n = [], o = 0, a = t.length; o < a; )
                    (e = t.charCodeAt(o++)) >= 55296 && e <= 56319 && o < a
                      ? 56320 == (64512 & (r = t.charCodeAt(o++)))
                        ? n.push(((1023 & e) << 10) + (1023 & r) + 65536)
                        : (n.push(e), o--)
                      : n.push(e)
                  return n
                })(t)).length,
                  e = V,
                  r = 0,
                  a = M,
                  i = 0;
                i < l;
                ++i
              )
                (f = t[i]) < 128 && m.push(J(f))
              for (n = o = m.length, o && m.push($); n < l; ) {
                for (s = F, i = 0; i < l; ++i) (f = t[i]) >= e && f < s && (s = f)
                for (
                  s - e > Z((F - r) / (p = n + 1)) && X('overflow'), r += (s - e) * p, e = s, i = 0;
                  i < l;
                  ++i
                )
                  if (((f = t[i]) < e && ++r > F && X('overflow'), f == e)) {
                    for (u = r, c = D; !(u < (h = c <= a ? H : c >= a + z ? z : c - a)); c += D)
                      (v = u - h), (y = D - h), m.push(J(tt(h + (v % y), 0))), (u = Z(v / y))
                    m.push(J(tt(u, 0))), (a = et(r, p, n == o)), (r = 0), ++n
                  }
                ++r, ++e
              }
              return m.join('')
            })(t)
        : t
    })
  }
  global.setTimeout, global.clearTimeout
  var nt = global.performance || {}
  nt.now || nt.mozNow || nt.msNow || nt.oNow || nt.webkitNow
  function ot (t) {
    return null === t
  }
  function at (t) {
    return 'string' == typeof t
  }
  function it (e) {
    return 'object' === t(e) && null !== e
  }
  function st (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e)
  }
  var ut =
    Array.isArray ||
    function (t) {
      return '[object Array]' === Object.prototype.toString.call(t)
    }
  function ct (e) {
    switch (t(e)) {
      case 'string':
        return e
      case 'boolean':
        return e ? 'true' : 'false'
      case 'number':
        return isFinite(e) ? e : ''
      default:
        return ''
    }
  }
  function ht (t, e) {
    if (t.map) return t.map(e)
    for (var r = [], n = 0; n < t.length; n++) r.push(e(t[n], n))
    return r
  }
  var ft =
    Object.keys ||
    function (t) {
      var e = []
      for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && e.push(r)
      return e
    }
  function lt (t, e, r, n) {
    ;(e = e || '&'), (r = r || '=')
    var o = {}
    if ('string' != typeof t || 0 === t.length) return o
    var a = /\+/g
    t = t.split(e)
    var i = 1e3
    n && 'number' == typeof n.maxKeys && (i = n.maxKeys)
    var s = t.length
    i > 0 && s > i && (s = i)
    for (var u = 0; u < s; ++u) {
      var c,
        h,
        f,
        l,
        p = t[u].replace(a, '%20'),
        y = p.indexOf(r)
      y >= 0 ? ((c = p.substr(0, y)), (h = p.substr(y + 1))) : ((c = p), (h = '')),
        (f = decodeURIComponent(c)),
        (l = decodeURIComponent(h)),
        st(o, f) ? (ut(o[f]) ? o[f].push(l) : (o[f] = [o[f], l])) : (o[f] = l)
    }
    return o
  }
  var pt = {
    parse: Rt,
    resolve: function (t, e) {
      return Rt(t, !1, !0).resolve(e)
    },
    resolveObject: function (t, e) {
      return t ? Rt(t, !1, !0).resolveObject(e) : e
    },
    format: function (t) {
      at(t) && (t = St({}, t))
      return Ct(t)
    },
    Url: yt
  }
  function yt () {
    ;(this.protocol = null),
      (this.slashes = null),
      (this.auth = null),
      (this.host = null),
      (this.port = null),
      (this.hostname = null),
      (this.hash = null),
      (this.search = null),
      (this.query = null),
      (this.pathname = null),
      (this.path = null),
      (this.href = null)
  }
  var vt = /^([a-z0-9.+-]+:)/i,
    mt = /:[0-9]*$/,
    dt = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
    bt = ['{', '}', '|', '\\', '^', '`'].concat(['<', '>', '"', '`', ' ', '\r', '\n', '\t']),
    gt = ["'"].concat(bt),
    wt = ['%', '/', '?', ';', '#'].concat(gt),
    xt = ['/', '?', '#'],
    jt = 255,
    Ot = /^[+a-z0-9A-Z_-]{0,63}$/,
    _t = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    kt = { javascript: !0, 'javascript:': !0 },
    At = { javascript: !0, 'javascript:': !0 },
    Et = {
      http: !0,
      https: !0,
      ftp: !0,
      gopher: !0,
      file: !0,
      'http:': !0,
      'https:': !0,
      'ftp:': !0,
      'gopher:': !0,
      'file:': !0
    }
  function Rt (t, e, r) {
    if (t && it(t) && t instanceof yt) return t
    var n = new yt()
    return n.parse(t, e, r), n
  }
  function St (e, r, n, o) {
    if (!at(r)) throw new TypeError("Parameter 'url' must be a string, not " + t(r))
    var a = r.indexOf('?'),
      i = -1 !== a && a < r.indexOf('#') ? '?' : '#',
      s = r.split(i)
    s[0] = s[0].replace(/\\/g, '/')
    var u = (r = s.join(i))
    if (((u = u.trim()), !o && 1 === r.split('#').length)) {
      var c = dt.exec(u)
      if (c)
        return (
          (e.path = u),
          (e.href = u),
          (e.pathname = c[1]),
          c[2]
            ? ((e.search = c[2]), (e.query = n ? lt(e.search.substr(1)) : e.search.substr(1)))
            : n && ((e.search = ''), (e.query = {})),
          e
        )
    }
    var h,
      f,
      l,
      p,
      y = vt.exec(u)
    if (y) {
      var v = (y = y[0]).toLowerCase()
      ;(e.protocol = v), (u = u.substr(y.length))
    }
    if (o || y || u.match(/^\/\/[^@\/]+@[^@\/]+/)) {
      var m = '//' === u.substr(0, 2)
      !m || (y && At[y]) || ((u = u.substr(2)), (e.slashes = !0))
    }
    if (!At[y] && (m || (y && !Et[y]))) {
      var d,
        b,
        g = -1
      for (h = 0; h < xt.length; h++)
        -1 !== (f = u.indexOf(xt[h])) && (-1 === g || f < g) && (g = f)
      for (
        -1 !== (b = -1 === g ? u.lastIndexOf('@') : u.lastIndexOf('@', g)) &&
          ((d = u.slice(0, b)), (u = u.slice(b + 1)), (e.auth = decodeURIComponent(d))),
          g = -1,
          h = 0;
        h < wt.length;
        h++
      )
        -1 !== (f = u.indexOf(wt[h])) && (-1 === g || f < g) && (g = f)
      ;-1 === g && (g = u.length),
        (e.host = u.slice(0, g)),
        (u = u.slice(g)),
        Pt(e),
        (e.hostname = e.hostname || '')
      var w = '[' === e.hostname[0] && ']' === e.hostname[e.hostname.length - 1]
      if (!w) {
        var x = e.hostname.split(/\./)
        for (h = 0, l = x.length; h < l; h++) {
          var j = x[h]
          if (j && !j.match(Ot)) {
            for (var O = '', _ = 0, k = j.length; _ < k; _++)
              j.charCodeAt(_) > 127 ? (O += 'x') : (O += j[_])
            if (!O.match(Ot)) {
              var A = x.slice(0, h),
                E = x.slice(h + 1),
                R = j.match(_t)
              R && (A.push(R[1]), E.unshift(R[2])),
                E.length && (u = '/' + E.join('.') + u),
                (e.hostname = A.join('.'))
              break
            }
          }
        }
      }
      e.hostname.length > jt ? (e.hostname = '') : (e.hostname = e.hostname.toLowerCase()),
        w || (e.hostname = rt(e.hostname)),
        (p = e.port ? ':' + e.port : '')
      var S = e.hostname || ''
      ;(e.host = S + p),
        (e.href += e.host),
        w &&
          ((e.hostname = e.hostname.substr(1, e.hostname.length - 2)),
          '/' !== u[0] && (u = '/' + u))
    }
    if (!kt[v])
      for (h = 0, l = gt.length; h < l; h++) {
        var C = gt[h]
        if (-1 !== u.indexOf(C)) {
          var P = encodeURIComponent(C)
          P === C && (P = escape(C)), (u = u.split(C).join(P))
        }
      }
    var L = u.indexOf('#')
    ;-1 !== L && ((e.hash = u.substr(L)), (u = u.slice(0, L)))
    var U = u.indexOf('?')
    if (
      (-1 !== U
        ? ((e.search = u.substr(U)),
          (e.query = u.substr(U + 1)),
          n && (e.query = lt(e.query)),
          (u = u.slice(0, U)))
        : n && ((e.search = ''), (e.query = {})),
      u && (e.pathname = u),
      Et[v] && e.hostname && !e.pathname && (e.pathname = '/'),
      e.pathname || e.search)
    ) {
      p = e.pathname || ''
      var T = e.search || ''
      e.path = p + T
    }
    return (e.href = Ct(e)), e
  }
  function Ct (e) {
    var r = e.auth || ''
    r && ((r = (r = encodeURIComponent(r)).replace(/%3A/i, ':')), (r += '@'))
    var n,
      o,
      a,
      i,
      s = e.protocol || '',
      u = e.pathname || '',
      c = e.hash || '',
      h = !1,
      f = ''
    e.host
      ? (h = r + e.host)
      : e.hostname &&
        ((h = r + (-1 === e.hostname.indexOf(':') ? e.hostname : '[' + this.hostname + ']')),
        e.port && (h += ':' + e.port)),
      e.query &&
        it(e.query) &&
        Object.keys(e.query).length &&
        ((n = e.query),
        (o = o || '&'),
        (a = a || '='),
        null === n && (n = void 0),
        (f =
          'object' === t(n)
            ? ht(ft(n), function (t) {
                var e = encodeURIComponent(ct(t)) + a
                return ut(n[t])
                  ? ht(n[t], function (t) {
                      return e + encodeURIComponent(ct(t))
                    }).join(o)
                  : e + encodeURIComponent(ct(n[t]))
              }).join(o)
            : i
            ? encodeURIComponent(ct(i)) + a + encodeURIComponent(ct(n))
            : ''))
    var l = e.search || (f && '?' + f) || ''
    return (
      s && ':' !== s.substr(-1) && (s += ':'),
      e.slashes || ((!s || Et[s]) && !1 !== h)
        ? ((h = '//' + (h || '')), u && '/' !== u.charAt(0) && (u = '/' + u))
        : h || (h = ''),
      c && '#' !== c.charAt(0) && (c = '#' + c),
      l && '?' !== l.charAt(0) && (l = '?' + l),
      s +
        h +
        (u = u.replace(/[?#]/g, function (t) {
          return encodeURIComponent(t)
        })) +
        (l = l.replace('#', '%23')) +
        c
    )
  }
  function Pt (t) {
    var e = t.host,
      r = mt.exec(e)
    r && (':' !== (r = r[0]) && (t.port = r.substr(1)), (e = e.substr(0, e.length - r.length))),
      e && (t.hostname = e)
  }
  ;(yt.prototype.parse = function (t, e, r) {
    return St(this, t, e, r)
  }),
    (yt.prototype.format = function () {
      return Ct(this)
    }),
    (yt.prototype.resolve = function (t) {
      return this.resolveObject(Rt(t, !1, !0)).format()
    }),
    (yt.prototype.resolveObject = function (t) {
      if (at(t)) {
        var e = new yt()
        e.parse(t, !1, !0), (t = e)
      }
      for (var r, n = new yt(), o = Object.keys(this), a = 0; a < o.length; a++) {
        var i = o[a]
        n[i] = this[i]
      }
      if (((n.hash = t.hash), '' === t.href)) return (n.href = n.format()), n
      if (t.slashes && !t.protocol) {
        for (var s = Object.keys(t), u = 0; u < s.length; u++) {
          var c = s[u]
          'protocol' !== c && (n[c] = t[c])
        }
        return (
          Et[n.protocol] && n.hostname && !n.pathname && (n.path = n.pathname = '/'),
          (n.href = n.format()),
          n
        )
      }
      if (t.protocol && t.protocol !== n.protocol) {
        if (!Et[t.protocol]) {
          for (var h = Object.keys(t), f = 0; f < h.length; f++) {
            var l = h[f]
            n[l] = t[l]
          }
          return (n.href = n.format()), n
        }
        if (((n.protocol = t.protocol), t.host || At[t.protocol])) n.pathname = t.pathname
        else {
          for (r = (t.pathname || '').split('/'); r.length && !(t.host = r.shift()); );
          t.host || (t.host = ''),
            t.hostname || (t.hostname = ''),
            '' !== r[0] && r.unshift(''),
            r.length < 2 && r.unshift(''),
            (n.pathname = r.join('/'))
        }
        if (
          ((n.search = t.search),
          (n.query = t.query),
          (n.host = t.host || ''),
          (n.auth = t.auth),
          (n.hostname = t.hostname || t.host),
          (n.port = t.port),
          n.pathname || n.search)
        ) {
          var p = n.pathname || '',
            y = n.search || ''
          n.path = p + y
        }
        return (n.slashes = n.slashes || t.slashes), (n.href = n.format()), n
      }
      var v,
        m = n.pathname && '/' === n.pathname.charAt(0),
        d = t.host || (t.pathname && '/' === t.pathname.charAt(0)),
        b = d || m || (n.host && t.pathname),
        g = b,
        w = (n.pathname && n.pathname.split('/')) || [],
        x = n.protocol && !Et[n.protocol]
      if (
        ((r = (t.pathname && t.pathname.split('/')) || []),
        x &&
          ((n.hostname = ''),
          (n.port = null),
          n.host && ('' === w[0] ? (w[0] = n.host) : w.unshift(n.host)),
          (n.host = ''),
          t.protocol &&
            ((t.hostname = null),
            (t.port = null),
            t.host && ('' === r[0] ? (r[0] = t.host) : r.unshift(t.host)),
            (t.host = null)),
          (b = b && ('' === r[0] || '' === w[0]))),
        d)
      )
        (n.host = t.host || '' === t.host ? t.host : n.host),
          (n.hostname = t.hostname || '' === t.hostname ? t.hostname : n.hostname),
          (n.search = t.search),
          (n.query = t.query),
          (w = r)
      else if (r.length)
        w || (w = []), w.pop(), (w = w.concat(r)), (n.search = t.search), (n.query = t.query)
      else if (null != t.search)
        return (
          x &&
            ((n.hostname = n.host = w.shift()),
            (v = !!(n.host && n.host.indexOf('@') > 0) && n.host.split('@')) &&
              ((n.auth = v.shift()), (n.host = n.hostname = v.shift()))),
          (n.search = t.search),
          (n.query = t.query),
          (ot(n.pathname) && ot(n.search)) ||
            (n.path = (n.pathname ? n.pathname : '') + (n.search ? n.search : '')),
          (n.href = n.format()),
          n
        )
      if (!w.length)
        return (
          (n.pathname = null),
          n.search ? (n.path = '/' + n.search) : (n.path = null),
          (n.href = n.format()),
          n
        )
      for (
        var j = w.slice(-1)[0],
          O = ((n.host || t.host || w.length > 1) && ('.' === j || '..' === j)) || '' === j,
          _ = 0,
          k = w.length;
        k >= 0;
        k--
      )
        '.' === (j = w[k])
          ? w.splice(k, 1)
          : '..' === j
          ? (w.splice(k, 1), _++)
          : _ && (w.splice(k, 1), _--)
      if (!b && !g) for (; _--; _) w.unshift('..')
      !b || '' === w[0] || (w[0] && '/' === w[0].charAt(0)) || w.unshift(''),
        O && '/' !== w.join('/').substr(-1) && w.push('')
      var A = '' === w[0] || (w[0] && '/' === w[0].charAt(0))
      return (
        x &&
          ((n.hostname = n.host = A ? '' : w.length ? w.shift() : ''),
          (v = !!(n.host && n.host.indexOf('@') > 0) && n.host.split('@')) &&
            ((n.auth = v.shift()), (n.host = n.hostname = v.shift()))),
        (b = b || (n.host && w.length)) && !A && w.unshift(''),
        w.length ? (n.pathname = w.join('/')) : ((n.pathname = null), (n.path = null)),
        (ot(n.pathname) && ot(n.search)) ||
          (n.path = (n.pathname ? n.pathname : '') + (n.search ? n.search : '')),
        (n.auth = t.auth || n.auth),
        (n.slashes = n.slashes || t.slashes),
        (n.href = n.format()),
        n
      )
    }),
    (yt.prototype.parseHost = function () {
      return Pt(this)
    })
  var Lt = pt.URL,
    Ut = /^https?:\/\//i,
    Tt = function (t) {
      return 'undefined' != typeof self && self && t in self
        ? self[t]
        : 'undefined' != typeof window && window && t in window
        ? window[t]
        : 'undefined' != typeof global && global && t in global
        ? global[t]
        : 'undefined' != typeof globalThis && globalThis
        ? globalThis[t]
        : void 0
    },
    Nt = Tt('document'),
    qt = Tt('Headers'),
    It = Tt('Response'),
    Ft = Tt('fetch'),
    Dt = Tt('AbortController'),
    Ht = function (e) {
      return null !== e && 'object' === t(e)
    },
    zt = 'function' == typeof Tt('AbortController'),
    Gt = function t () {
      for (var e = {}, r = arguments.length, n = new Array(r), o = 0; o < r; o++)
        n[o] = arguments[o]
      for (var s = 0; s < n.length; s++) {
        var u = n[s]
        if (Array.isArray(u)) Array.isArray(e) || (e = []), (e = [].concat(v(e), v(u)))
        else if (Ht(u))
          for (var c = Object.entries(u), h = 0; h < c.length; h++) {
            var f = y(c[h], 2),
              l = f[0],
              p = f[1]
            Ht(p) && Reflect.has(e, l) && (p = t(e[l], p)), (e = i({}, e, a({}, l, p)))
          }
      }
      return e
    },
    Bt = ['get', 'post', 'put', 'patch', 'head', 'delete'],
    Mt = ['json', 'text', 'formData', 'arrayBuffer', 'blob'],
    Vt = new Set(['get', 'put', 'head', 'delete', 'options', 'trace']),
    $t = new Set([408, 413, 429, 500, 502, 503, 504]),
    Kt = new Set([413, 429, 503]),
    Qt = (function (t) {
      function e (t) {
        var r
        return (
          n(this, e),
          ((r = p(this, u(e).call(this, t.statusText))).name = 'HTTPError'),
          (r.response = t),
          r
        )
      }
      return s(e, f(Error)), e
    })(),
    Wt = (function (t) {
      function e () {
        var t
        return (
          n(this, e), ((t = p(this, u(e).call(this, 'Request timed out'))).name = 'TimeoutError'), t
        )
      }
      return s(e, f(Error)), e
    })(),
    Yt = function (t) {
      return new Promise(function (e) {
        return setTimeout(e, t)
      })
    },
    Zt = function (t, e, n) {
      return Promise.race([
        t,
        r(
          j.mark(function t () {
            return j.wrap(function (t) {
              for (;;)
                switch ((t.prev = t.next)) {
                  case 0:
                    return (t.next = 2), Yt(e)
                  case 2:
                    throw (n &&
                      setTimeout(function () {
                        return n.abort()
                      }, 1),
                    new Wt())
                  case 4:
                  case 'end':
                    return t.stop()
                }
            }, t)
          })
        )()
      ])
    },
    Jt = function (t) {
      return Bt.includes(t) ? t.toUpperCase() : t
    },
    Xt = (function () {
      function t (e, o) {
        var a = this,
          s = o.timeout,
          u = void 0 === s ? 1e4 : s,
          c = o.hooks,
          h = o.throwHttpErrors,
          f = void 0 === h || h,
          p = o.searchParams,
          y = o.json,
          v = l(o, ['timeout', 'hooks', 'throwHttpErrors', 'searchParams', 'json'])
        if (
          (n(this, t),
          (this._retryCount = 0),
          (this._options = i({ method: 'get', credentials: 'same-origin', retry: 2 }, v)),
          zt &&
            ((this.abortController = new Dt()),
            this._options.signal &&
              this._options.signal.addEventListener('abort', function () {
                a.abortController.abort()
              }),
            (this._options.signal = this.abortController.signal)),
          (this._options.method = Jt(this._options.method)),
          (this._options.prefixUrl = String(this._options.prefixUrl || '')),
          (this._input = String(e || '')),
          this._options.prefixUrl && this._input.startsWith('/'))
        )
          throw new Error('`input` must not begin with a slash when using `prefixUrl`')
        if (
          (this._options.prefixUrl &&
            !this._options.prefixUrl.endsWith('/') &&
            (this._options.prefixUrl += '/'),
          (this._input = this._options.prefixUrl + this._input),
          p)
        ) {
          var m = new URL(this._input, Nt && Nt.baseURI)
          if ('string' == typeof p || (URLSearchParams && p instanceof URLSearchParams))
            m.search = p
          else {
            if (
              !Object.values(p).every(function (t) {
                return 'number' == typeof t || 'string' == typeof t
              })
            )
              throw new Error(
                'The `searchParams` option must be either a string, `URLSearchParams` instance or an object with string and number values'
              )
            m.search = new URLSearchParams(p).toString()
          }
          this._input = m.toString()
        }
        ;(this._timeout = u),
          (this._hooks = Gt({ beforeRequest: [], afterResponse: [] }, c)),
          (this._throwHttpErrors = f)
        var d = new qt(this._options.headers || {})
        if (y) {
          if (this._options.body)
            throw new Error('The `json` option cannot be used with the `body` option')
          d.set('content-type', 'application/json'), (this._options.body = JSON.stringify(y))
        }
        this._options.headers = d
        for (
          var b = (function () {
              var t = r(
                j.mark(function t () {
                  var e, r, n, o, i, s, u, c
                  return j.wrap(
                    function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return (t.next = 2), a._fetch()
                          case 2:
                            ;(e = t.sent),
                              (r = !0),
                              (n = !1),
                              (o = void 0),
                              (t.prev = 6),
                              (i = a._hooks.afterResponse[Symbol.iterator]())
                          case 8:
                            if ((r = (s = i.next()).done)) {
                              t.next = 17
                              break
                            }
                            return (u = s.value), (t.next = 12), u(e.clone())
                          case 12:
                            ;(c = t.sent) instanceof It && (e = c)
                          case 14:
                            ;(r = !0), (t.next = 8)
                            break
                          case 17:
                            t.next = 23
                            break
                          case 19:
                            ;(t.prev = 19), (t.t0 = t.catch(6)), (n = !0), (o = t.t0)
                          case 23:
                            ;(t.prev = 23), (t.prev = 24), r || null == i.return || i.return()
                          case 26:
                            if (((t.prev = 26), !n)) {
                              t.next = 29
                              break
                            }
                            throw o
                          case 29:
                            return t.finish(26)
                          case 30:
                            return t.finish(23)
                          case 31:
                            if (e.ok || !a._throwHttpErrors) {
                              t.next = 33
                              break
                            }
                            throw new Qt(e)
                          case 33:
                            return t.abrupt('return', e)
                          case 34:
                          case 'end':
                            return t.stop()
                        }
                    },
                    t,
                    null,
                    [[6, 19, 23, 31], [24, , 26, 30]]
                  )
                })
              )
              return function () {
                return t.apply(this, arguments)
              }
            })(),
            g = Vt.has(this._options.method.toLowerCase()) ? this._retry(b) : b(),
            w = function () {
              var t = Mt[x]
              g[t] = r(
                j.mark(function e () {
                  return j.wrap(function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (e.next = 2), g
                        case 2:
                          return (e.t0 = t), e.abrupt('return', e.sent.clone()[e.t0]())
                        case 4:
                        case 'end':
                          return e.stop()
                      }
                  }, e)
                })
              )
            },
            x = 0;
          x < Mt.length;
          x++
        )
          w()
        return g
      }
      var e, a, s
      return (
        (e = t),
        (a = [
          {
            key: '_calculateRetryDelay',
            value: function (t) {
              if (
                (this._retryCount++, this._retryCount < this._options.retry && !(t instanceof Wt))
              ) {
                if (t instanceof Qt) {
                  if (!$t.has(t.response.status)) return 0
                  var e = t.response.headers.get('Retry-After')
                  if (e && Kt.has(t.response.status)) {
                    var r = Number(e)
                    return Number.isNaN(r) ? (r = Date.parse(e) - Date.now()) : (r *= 1e3), r
                  }
                  if (413 === t.response.status) return 0
                }
                return 0.3 * Math.pow(2, this._retryCount - 1) * 1e3
              }
              return 0
            }
          },
          {
            key: '_retry',
            value: (function () {
              var t = r(
                j.mark(function t (e) {
                  var r
                  return j.wrap(
                    function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return (t.prev = 0), (t.next = 3), e()
                          case 3:
                            return t.abrupt('return', t.sent)
                          case 6:
                            if (
                              ((t.prev = 6),
                              (t.t0 = t.catch(0)),
                              !(
                                0 !== (r = this._calculateRetryDelay(t.t0)) && this._retryCount > 0
                              ))
                            ) {
                              t.next = 13
                              break
                            }
                            return (t.next = 12), Yt(r)
                          case 12:
                            return t.abrupt('return', this._retry(e))
                          case 13:
                            if (!this._throwHttpErrors) {
                              t.next = 15
                              break
                            }
                            throw t.t0
                          case 15:
                          case 'end':
                            return t.stop()
                        }
                    },
                    t,
                    this,
                    [[0, 6]]
                  )
                })
              )
              return function (e) {
                return t.apply(this, arguments)
              }
            })()
          },
          {
            key: '_fetch',
            value: (function () {
              var t = r(
                j.mark(function t () {
                  var e, r, n, o, a, i
                  return j.wrap(
                    function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            ;(e = !0),
                              (r = !1),
                              (n = void 0),
                              (t.prev = 3),
                              (o = this._hooks.beforeRequest[Symbol.iterator]())
                          case 5:
                            if ((e = (a = o.next()).done)) {
                              t.next = 12
                              break
                            }
                            return (i = a.value), (t.next = 9), i(this._options)
                          case 9:
                            ;(e = !0), (t.next = 5)
                            break
                          case 12:
                            t.next = 18
                            break
                          case 14:
                            ;(t.prev = 14), (t.t0 = t.catch(3)), (r = !0), (n = t.t0)
                          case 18:
                            ;(t.prev = 18), (t.prev = 19), e || null == o.return || o.return()
                          case 21:
                            if (((t.prev = 21), !r)) {
                              t.next = 24
                              break
                            }
                            throw n
                          case 24:
                            return t.finish(21)
                          case 25:
                            return t.finish(18)
                          case 26:
                            return t.abrupt(
                              'return',
                              Zt(
                                Ft(this._input, this._options),
                                this._timeout,
                                this.abortController
                              )
                            )
                          case 27:
                          case 'end':
                            return t.stop()
                        }
                    },
                    t,
                    this,
                    [[3, 14, 18, 26], [19, , 21, 25]]
                  )
                })
              )
              return function () {
                return t.apply(this, arguments)
              }
            })()
          }
        ]) && o(e.prototype, a),
        s && o(e, s),
        t
      )
    })(),
    te = (function t () {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
      if (!Ht(e) || Array.isArray(e))
        throw new TypeError('The `defaultOptions` argument must be an object')
      for (
        var r = function (t, r) {
            return new Xt(t, Gt({}, e, r))
          },
          n = function () {
            var t = Bt[o]
            r[t] = function (r, n) {
              return new Xt(r, Gt({}, e, n, { method: t }))
            }
          },
          o = 0;
        o < Bt.length;
        o++
      )
        n()
      return (
        (r.extend = function (e) {
          return t(e)
        }),
        r
      )
    })()
  return require('./factory')({
    MicrolinkError: require('whoops')('MicrolinkError'),
    isUrlHttp: function (t) {
      try {
        return new Lt(t) && Ut.test(t)
      } catch (t) {
        return !1
      }
    },
    stringify: I,
    got: (function () {
      var t = r(
        j.mark(function t (e, r) {
          var n, o, a, i, s, u
          return j.wrap(
            function (t) {
              for (;;)
                switch ((t.prev = t.next)) {
                  case 0:
                    return (
                      r.json,
                      r.headers,
                      (n = l(r, ['json', 'headers'])),
                      (t.prev = 1),
                      (t.next = 4),
                      te(e, n)
                    )
                  case 4:
                    return (o = t.sent), (t.next = 7), o.json()
                  case 7:
                    return (
                      (a = t.sent),
                      (i = o.headers),
                      (s = o.status),
                      (u = o.statusText),
                      t.abrupt('return', {
                        url: o.url,
                        body: a,
                        headers: i,
                        statusCode: s,
                        statusMessage: u
                      })
                    )
                  case 12:
                    if (((t.prev = 12), (t.t0 = t.catch(1)), !t.t0.response)) {
                      t.next = 20
                      break
                    }
                    return (t.next = 17), t.t0.response.json()
                  case 17:
                    ;(t.t1 = t.sent), (t.next = 21)
                    break
                  case 20:
                    t.t1 = ''
                  case 21:
                    throw ((t.t0.body = t.t1),
                    (t.t0.statusCode = t.t0.response.status),
                    (t.t0.headers = t.t0.response.headers),
                    t.t0)
                  case 25:
                  case 'end':
                    return t.stop()
                }
            },
            t,
            null,
            [[1, 12]]
          )
        })
      )
      return function (e, r) {
        return t.apply(this, arguments)
      }
    })()
  })
})
