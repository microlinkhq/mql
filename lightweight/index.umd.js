!(function (e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? t(exports)
    : 'function' == typeof define && define.amd
    ? define(['exports'], t)
    : t(
        ((e =
          'undefined' != typeof globalThis ? globalThis : e || self).mql = {})
      )
})(this, function (e) {
  'use strict'
  function t (e) {
    return e &&
      e.__esModule &&
      Object.prototype.hasOwnProperty.call(e, 'default')
      ? e.default
      : e
  }
  function r (e) {
    if (e.__esModule) return e
    var t = e.default
    if ('function' == typeof t) {
      var r = function e () {
        return this instanceof e
          ? Reflect.construct(t, arguments, this.constructor)
          : t.apply(this, arguments)
      }
      r.prototype = t.prototype
    } else r = {}
    return (
      Object.defineProperty(r, '__esModule', { value: !0 }),
      Object.keys(e).forEach(function (t) {
        var s = Object.getOwnPropertyDescriptor(e, t)
        Object.defineProperty(
          r,
          t,
          s.get
            ? s
            : {
                enumerable: !0,
                get: function () {
                  return e[t]
                }
              }
        )
      }),
      r
    )
  }
  var s = { exports: {} }
  const o = /^https?:\/\//i
  var n = {}
  function i (e, t, r, s, o) {
    var n,
      a = o ? o + r : o
    if (null == s) t && (e[o] = s)
    else if ('object' != typeof s) e[o] = s
    else if (Array.isArray(s))
      for (n = 0; n < s.length; n++) i(e, t, r, s[n], a + n)
    else for (n in s) i(e, t, r, s[n], a + n)
  }
  n.flattie = function (e, t, r) {
    var s = {}
    return 'object' == typeof e && i(s, !!r, t || '.', e, ''), s
  }
  class a extends Error {
    constructor (e, t, r) {
      const s = `${e.status || 0 === e.status ? e.status : ''} ${e.statusText ||
        ''}`.trim()
      super(
        `Request failed with ${s ? `status code ${s}` : 'an unknown error'}`
      ),
        Object.defineProperty(this, 'response', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }),
        Object.defineProperty(this, 'request', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }),
        Object.defineProperty(this, 'options', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }),
        (this.name = 'HTTPError'),
        (this.response = e),
        (this.request = t),
        (this.options = r)
    }
  }
  class u extends Error {
    constructor (e) {
      super('Request timed out'),
        Object.defineProperty(this, 'request', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }),
        (this.name = 'TimeoutError'),
        (this.request = e)
    }
  }
  const l = e => null !== e && 'object' == typeof e,
    c = (...e) => {
      for (const t of e)
        if ((!l(t) || Array.isArray(t)) && void 0 !== t)
          throw new TypeError('The `options` argument must be an object')
      return p({}, ...e)
    },
    h = (e = {}, t = {}) => {
      const r = new globalThis.Headers(e),
        s = t instanceof globalThis.Headers,
        o = new globalThis.Headers(t)
      for (const [e, t] of o.entries())
        (s && 'undefined' === t) || void 0 === t ? r.delete(e) : r.set(e, t)
      return r
    },
    p = (...e) => {
      let t = {},
        r = {}
      for (const s of e)
        if (Array.isArray(s)) Array.isArray(t) || (t = []), (t = [...t, ...s])
        else if (l(s)) {
          for (let [e, r] of Object.entries(s))
            l(r) && e in t && (r = p(t[e], r)), (t = { ...t, [e]: r })
          l(s.headers) && ((r = h(r, s.headers)), (t.headers = r))
        }
      return t
    },
    f = (() => {
      let e = !1,
        t = !1
      const r = 'function' == typeof globalThis.ReadableStream,
        s = 'function' == typeof globalThis.Request
      return (
        r &&
          s &&
          (t = new globalThis.Request('https://empty.invalid', {
            body: new globalThis.ReadableStream(),
            method: 'POST',
            get duplex () {
              return (e = !0), 'half'
            }
          }).headers.has('Content-Type')),
        e && !t
      )
    })(),
    d = 'function' == typeof globalThis.AbortController,
    y = 'function' == typeof globalThis.ReadableStream,
    b = 'function' == typeof globalThis.FormData,
    m = ['get', 'post', 'put', 'patch', 'head', 'delete'],
    _ = {
      json: 'application/json',
      text: 'text/*',
      formData: 'multipart/form-data',
      arrayBuffer: '*/*',
      blob: '*/*'
    },
    g = 2147483647,
    w = Symbol('stop'),
    T = {
      json: !0,
      parseJson: !0,
      searchParams: !0,
      prefixUrl: !0,
      retry: !0,
      timeout: !0,
      hooks: !0,
      throwHttpErrors: !0,
      onDownloadProgress: !0,
      fetch: !0
    },
    R = {
      method: !0,
      headers: !0,
      body: !0,
      mode: !0,
      credentials: !0,
      cache: !0,
      redirect: !0,
      referrer: !0,
      referrerPolicy: !0,
      integrity: !0,
      keepalive: !0,
      signal: !0,
      window: !0,
      dispatcher: !0,
      duplex: !0
    },
    v = e => (m.includes(e) ? e.toUpperCase() : e),
    x = [413, 429, 503],
    E = {
      limit: 2,
      methods: ['get', 'put', 'head', 'delete', 'options', 'trace'],
      statusCodes: [408, 413, 429, 500, 502, 503, 504],
      afterStatusCodes: x,
      maxRetryAfter: Number.POSITIVE_INFINITY,
      backoffLimit: Number.POSITIVE_INFINITY,
      delay: e => 0.3 * 2 ** (e - 1) * 1e3
    },
    q = (e = {}) => {
      if ('number' == typeof e) return { ...E, limit: e }
      if (e.methods && !Array.isArray(e.methods))
        throw new Error('retry.methods must be an array')
      if (e.statusCodes && !Array.isArray(e.statusCodes))
        throw new Error('retry.statusCodes must be an array')
      return { ...E, ...e, afterStatusCodes: x }
    }
  class P {
    static create (e, t) {
      const r = new P(e, t),
        s = async () => {
          if ('number' == typeof r._options.timeout && r._options.timeout > g)
            throw new RangeError(
              'The `timeout` option cannot be greater than 2147483647'
            )
          await Promise.resolve()
          let e = await r._fetch()
          for (const t of r._options.hooks.afterResponse) {
            const s = await t(
              r.request,
              r._options,
              r._decorateResponse(e.clone())
            )
            s instanceof globalThis.Response && (e = s)
          }
          if ((r._decorateResponse(e), !e.ok && r._options.throwHttpErrors)) {
            let t = new a(e, r.request, r._options)
            for (const e of r._options.hooks.beforeError) t = await e(t)
            throw t
          }
          if (r._options.onDownloadProgress) {
            if ('function' != typeof r._options.onDownloadProgress)
              throw new TypeError(
                'The `onDownloadProgress` option must be a function'
              )
            if (!y)
              throw new Error(
                'Streams are not supported in your environment. `ReadableStream` is missing.'
              )
            return r._stream(e.clone(), r._options.onDownloadProgress)
          }
          return e
        },
        o = r._options.retry.methods.includes(r.request.method.toLowerCase())
          ? r._retry(s)
          : s()
      for (const [e, s] of Object.entries(_))
        o[e] = async () => {
          r.request.headers.set('accept', r.request.headers.get('accept') || s)
          const n = (await o).clone()
          if ('json' === e) {
            if (204 === n.status) return ''
            if (0 === (await n.clone().arrayBuffer()).byteLength) return ''
            if (t.parseJson) return t.parseJson(await n.text())
          }
          return n[e]()
        }
      return o
    }
    constructor (e, t = {}) {
      Object.defineProperty(this, 'request', {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }),
        Object.defineProperty(this, 'abortController', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }),
        Object.defineProperty(this, '_retryCount', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: 0
        }),
        Object.defineProperty(this, '_input', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }),
        Object.defineProperty(this, '_options', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0
        }),
        (this._input = e)
      const r = 'credentials' in Request.prototype
      if (
        ((this._options = {
          credentials: r ? this._input.credentials : void 0,
          ...t,
          headers: h(this._input.headers, t.headers),
          hooks: p(
            {
              beforeRequest: [],
              beforeRetry: [],
              beforeError: [],
              afterResponse: []
            },
            t.hooks
          ),
          method: v(t.method ?? this._input.method),
          prefixUrl: String(t.prefixUrl || ''),
          retry: q(t.retry),
          throwHttpErrors: !1 !== t.throwHttpErrors,
          timeout: t.timeout ?? 1e4,
          fetch: t.fetch ?? globalThis.fetch.bind(globalThis)
        }),
        'string' != typeof this._input &&
          !(
            this._input instanceof URL ||
            this._input instanceof globalThis.Request
          ))
      )
        throw new TypeError('`input` must be a string, URL, or Request')
      if (this._options.prefixUrl && 'string' == typeof this._input) {
        if (this._input.startsWith('/'))
          throw new Error(
            '`input` must not begin with a slash when using `prefixUrl`'
          )
        this._options.prefixUrl.endsWith('/') ||
          (this._options.prefixUrl += '/'),
          (this._input = this._options.prefixUrl + this._input)
      }
      if (d) {
        if (
          ((this.abortController = new globalThis.AbortController()),
          this._options.signal)
        ) {
          const e = this._options.signal
          this._options.signal.addEventListener('abort', () => {
            this.abortController.abort(e.reason)
          })
        }
        this._options.signal = this.abortController.signal
      }
      if (
        (f && (this._options.duplex = 'half'),
        (this.request = new globalThis.Request(this._input, this._options)),
        this._options.searchParams)
      ) {
        const e =
            '?' +
            ('string' == typeof this._options.searchParams
              ? this._options.searchParams.replace(/^\?/, '')
              : new URLSearchParams(this._options.searchParams).toString()),
          t = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, e)
        !(
          (b && this._options.body instanceof globalThis.FormData) ||
          this._options.body instanceof URLSearchParams
        ) ||
          (this._options.headers && this._options.headers['content-type']) ||
          this.request.headers.delete('content-type'),
          (this.request = new globalThis.Request(
            new globalThis.Request(t, { ...this.request }),
            this._options
          ))
      }
      void 0 !== this._options.json &&
        ((this._options.body = JSON.stringify(this._options.json)),
        this.request.headers.set(
          'content-type',
          this._options.headers.get('content-type') ?? 'application/json'
        ),
        (this.request = new globalThis.Request(this.request, {
          body: this._options.body
        })))
    }
    _calculateRetryDelay (e) {
      if (
        (this._retryCount++,
        this._retryCount <= this._options.retry.limit && !(e instanceof u))
      ) {
        if (e instanceof a) {
          if (!this._options.retry.statusCodes.includes(e.response.status))
            return 0
          const t = e.response.headers.get('Retry-After')
          if (
            t &&
            this._options.retry.afterStatusCodes.includes(e.response.status)
          ) {
            let e = Number(t)
            return (
              Number.isNaN(e) ? (e = Date.parse(t) - Date.now()) : (e *= 1e3),
              void 0 !== this._options.retry.maxRetryAfter &&
              e > this._options.retry.maxRetryAfter
                ? 0
                : e
            )
          }
          if (413 === e.response.status) return 0
        }
        const t = this._options.retry.delay(this._retryCount)
        return Math.min(this._options.retry.backoffLimit, t)
      }
      return 0
    }
    _decorateResponse (e) {
      return (
        this._options.parseJson &&
          (e.json = async () => this._options.parseJson(await e.text())),
        e
      )
    }
    async _retry (e) {
      try {
        return await e()
      } catch (t) {
        const r = Math.min(this._calculateRetryDelay(t), g)
        if (0 !== r && this._retryCount > 0) {
          await (async function (e, { signal: t }) {
            return new Promise((r, s) => {
              function o () {
                clearTimeout(n), s(t.reason)
              }
              t &&
                (t.throwIfAborted(),
                t.addEventListener('abort', o, { once: !0 }))
              const n = setTimeout(() => {
                t?.removeEventListener('abort', o), r()
              }, e)
            })
          })(r, { signal: this._options.signal })
          for (const e of this._options.hooks.beforeRetry) {
            if (
              (await e({
                request: this.request,
                options: this._options,
                error: t,
                retryCount: this._retryCount
              })) === w
            )
              return
          }
          return this._retry(e)
        }
        throw t
      }
    }
    async _fetch () {
      for (const e of this._options.hooks.beforeRequest) {
        const t = await e(this.request, this._options)
        if (t instanceof Request) {
          this.request = t
          break
        }
        if (t instanceof Response) return t
      }
      const e = ((e, t) => {
        const r = {}
        for (const s in t) s in R || s in T || s in e || (r[s] = t[s])
        return r
      })(this.request, this._options)
      return !1 === this._options.timeout
        ? this._options.fetch(this.request.clone(), e)
        : (async function (e, t, r, s) {
            return new Promise((o, n) => {
              const i = setTimeout(() => {
                r && r.abort(), n(new u(e))
              }, s.timeout)
              s.fetch(e, t)
                .then(o)
                .catch(n)
                .then(() => {
                  clearTimeout(i)
                })
            })
          })(this.request.clone(), e, this.abortController, this._options)
    }
    _stream (e, t) {
      const r = Number(e.headers.get('content-length')) || 0
      let s = 0
      return 204 === e.status
        ? (t &&
            t(
              { percent: 1, totalBytes: r, transferredBytes: s },
              new Uint8Array()
            ),
          new globalThis.Response(null, {
            status: e.status,
            statusText: e.statusText,
            headers: e.headers
          }))
        : new globalThis.Response(
            new globalThis.ReadableStream({
              async start (o) {
                const n = e.body.getReader()
                t &&
                  t(
                    { percent: 0, transferredBytes: 0, totalBytes: r },
                    new Uint8Array()
                  ),
                  await (async function e () {
                    const { done: i, value: a } = await n.read()
                    if (i) o.close()
                    else {
                      if (t) {
                        s += a.byteLength
                        t(
                          {
                            percent: 0 === r ? 0 : s / r,
                            transferredBytes: s,
                            totalBytes: r
                          },
                          a
                        )
                      }
                      o.enqueue(a), await e()
                    }
                  })()
              }
            }),
            { status: e.status, statusText: e.statusText, headers: e.headers }
          )
    }
  }
  const j = e => {
      const t = (t, r) => P.create(t, c(e, r))
      for (const r of m) t[r] = (t, s) => P.create(t, c(e, s, { method: r }))
      return (
        (t.create = e => j(c(e))), (t.extend = t => j(c(e, t))), (t.stop = w), t
      )
    },
    A = j()
  var C = r(
    Object.freeze({
      __proto__: null,
      HTTPError: a,
      TimeoutError: u,
      default: A
    })
  )
  const O = {
      FREE: 'https://api.microlink.io/',
      PRO: 'https://pro.microlink.io/'
    },
    k = e => null !== e && 'object' == typeof e
  var S = e => ({
    VERSION: t,
    MicrolinkError: r,
    urlHttp: s,
    got: o,
    flatten: n
  }) => {
    const i = e => {
        if (!k(e)) return
        const t = n(e)
        return Object.keys(t).reduce(
          (e, r) => ((e[`data.${r}`] = t[r].toString()), e),
          {}
        )
      },
      a = async (t, s = {}) => {
        try {
          const r = await o(t, s)
          return s.responseType === e ? r : { ...r.body, response: r }
        } catch (e) {
          const { response: s = {} } = e,
            { statusCode: o, body: i, headers: a = {}, url: u = t } = s,
            l =
              null != (n = i) &&
              null != n.constructor &&
              'function' == typeof n.constructor.isBuffer &&
              n.constructor.isBuffer(n),
            c =
              k(i) && !l
                ? i
                : ((e, t, r) => {
                    try {
                      return JSON.parse(e)
                    } catch (s) {
                      const o = e || t.message
                      return {
                        status: 'error',
                        data: { url: o },
                        more: 'https://microlink.io/efatalclient',
                        code: 'EFATALCLIENT',
                        message: o,
                        url: r
                      }
                    }
                  })(l ? i.toString() : i, e, u)
          throw new r({
            ...c,
            message: c.message,
            url: u,
            statusCode: o,
            headers: a
          })
        }
        var n
      },
      u = (
        t,
        { data: r, apiKey: s, endpoint: o, retry: a, cache: u, ...l } = {},
        { responseType: c = 'json', headers: h, ...p } = {}
      ) => {
        const f = !!s,
          d = `${o || O[f ? 'PRO' : 'FREE']}?${new URLSearchParams({
            url: t,
            ...i(r),
            ...n(l)
          }).toString()}`,
          y = f ? { ...h, 'x-api-key': s } : { ...h }
        return (
          l.stream && (c = e),
          [d, { ...p, responseType: c, cache: u, retry: a, headers: y }]
        )
      },
      l = e => async (t, o, n) => {
        ;((e = '') => {
          if (!s(e)) {
            const t = `The \`url\` as \`${e}\` is not valid. Ensure it has protocol (http or https) and hostname.`
            throw new r({
              status: 'fail',
              data: { url: t },
              more: 'https://microlink.io/docs/api/api-parameters/url',
              code: 'EINVALURLCLIENT',
              message: t,
              url: e
            })
          }
        })(t)
        const [i, l] = u(t, o, { ...e, ...n })
        return a(i, l)
      },
      c = l()
    return (
      (c.extend = l),
      (c.MicrolinkError = r),
      (c.getApiUrl = u),
      (c.fetchFromApi = a),
      (c.mapRules = i),
      (c.version = t),
      (c.stream = o.stream),
      c
    )
  }
  const U = e => {
      try {
        const { href: t } = new URL(e)
        return o.test(t) && t
      } catch (e) {
        return !1
      }
    },
    { flattie: L } = n,
    { default: N } = C,
    I = S('arrayBuffer')
  class B extends Error {
    constructor (e) {
      super(),
        (this.name = 'MicrolinkError'),
        Object.assign(this, e),
        (this.description = this.message),
        (this.message = this.code
          ? `${this.code}, ${this.description}`
          : this.description)
    }
  }
  const D = async (e, { responseType: t, ...r }) => {
    try {
      void 0 === r.timeout && (r.timeout = !1)
      const s = await N(e, r),
        o = await s[t](),
        { headers: n, status: i } = s
      return { url: s.url, body: o, headers: n, statusCode: i }
    } catch (e) {
      if (e.response) {
        const { response: t } = e
        e.response = {
          ...t,
          headers: Array.from(t.headers.entries()).reduce(
            (e, [t, r]) => ((e[t] = r), e),
            {}
          ),
          statusCode: t.status,
          body: await t.text()
        }
      }
      throw e
    }
  }
  D.stream = (...e) => N(...e).then(e => e.body)
  const M = I({
    MicrolinkError: B,
    urlHttp: U,
    got: D,
    flatten: L,
    VERSION: '0.13.0'
  })
  s.exports = M
  var F = (s.exports.arrayBuffer = M.extend({ responseType: 'arrayBuffer' })),
    H = (s.exports.extend = M.extend),
    $ = (s.exports.fetchFromApi = M.fetchFromApi),
    J = (s.exports.getApiUrl = M.getApiUrl),
    V = (s.exports.mapRules = M.mapRules),
    W = (s.exports.MicrolinkError = M.MicrolinkError),
    Y = (s.exports.version = M.version),
    z = t(s.exports)
  ;(e.MicrolinkError = W),
    (e.arrayBuffer = F),
    (e.default = z),
    (e.extend = H),
    (e.fetchFromApi = $),
    (e.getApiUrl = J),
    (e.mapRules = V),
    (e.version = Y),
    Object.defineProperty(e, '__esModule', { value: !0 })
})
