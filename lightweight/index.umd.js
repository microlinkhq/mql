;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : typeof define === 'function' && define.amd
    ? define(['exports'], factory)
    : ((global =
        typeof globalThis !== 'undefined' ? globalThis : global || self),
      factory((global.mql = {})))
})(this, function (exports) {
  'use strict'

  function getDefaultExportFromCjs (x) {
    return x &&
      x.__esModule &&
      Object.prototype.hasOwnProperty.call(x, 'default')
      ? x['default']
      : x
  }

  function getAugmentedNamespace (n) {
    if (n.__esModule) return n
    var f = n.default
    if (typeof f == 'function') {
      var a = function a () {
        if (this instanceof a) {
          return Reflect.construct(f, arguments, this.constructor)
        }
        return f.apply(this, arguments)
      }
      a.prototype = f.prototype
    } else a = {}
    Object.defineProperty(a, '__esModule', { value: true })
    Object.keys(n).forEach(function (k) {
      var d = Object.getOwnPropertyDescriptor(n, k)
      Object.defineProperty(
        a,
        k,
        d.get
          ? d
          : {
              enumerable: true,
              get: function () {
                return n[k]
              }
            }
      )
    })
    return a
  }

  var lightweight$2 = { exports: {} }

  const REGEX_HTTP_PROTOCOL = /^https?:\/\//i

  var lightweight$1 = url => {
    try {
      const { href } = new URL(url)
      return REGEX_HTTP_PROTOCOL.test(href) && href
    } catch (err) {
      return false
    }
  }

  var dist = {}

  function iter (output, nullish, sep, val, key) {
    var k,
      pfx = key ? key + sep : key

    if (val == null) {
      if (nullish) output[key] = val
    } else if (typeof val != 'object') {
      output[key] = val
    } else if (Array.isArray(val)) {
      for (k = 0; k < val.length; k++) {
        iter(output, nullish, sep, val[k], pfx + k)
      }
    } else {
      for (k in val) {
        iter(output, nullish, sep, val[k], pfx + k)
      }
    }
  }

  function flattie (input, glue, toNull) {
    var output = {}
    if (typeof input == 'object') {
      iter(output, !!toNull, glue || '.', input, '')
    }
    return output
  }

  dist.flattie = flattie

  // eslint-lint-disable-next-line @typescript-eslint/naming-convention
  class HTTPError extends Error {
    constructor (response, request, options) {
      const code =
        response.status || response.status === 0 ? response.status : ''
      const title = response.statusText || ''
      const status = `${code} ${title}`.trim()
      const reason = status ? `status code ${status}` : 'an unknown error'
      super(`Request failed with ${reason}`)
      Object.defineProperty(this, 'response', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      })
      Object.defineProperty(this, 'request', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      })
      Object.defineProperty(this, 'options', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      })
      this.name = 'HTTPError'
      this.response = response
      this.request = request
      this.options = options
    }
  }

  class TimeoutError extends Error {
    constructor (request) {
      super('Request timed out')
      Object.defineProperty(this, 'request', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      })
      this.name = 'TimeoutError'
      this.request = request
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  const isObject$1 = value => value !== null && typeof value === 'object'

  const validateAndMerge = (...sources) => {
    for (const source of sources) {
      if (
        (!isObject$1(source) || Array.isArray(source)) &&
        source !== undefined
      ) {
        throw new TypeError('The `options` argument must be an object')
      }
    }
    return deepMerge({}, ...sources)
  }
  const mergeHeaders = (source1 = {}, source2 = {}) => {
    const result = new globalThis.Headers(source1)
    const isHeadersInstance = source2 instanceof globalThis.Headers
    const source = new globalThis.Headers(source2)
    for (const [key, value] of source.entries()) {
      if ((isHeadersInstance && value === 'undefined') || value === undefined) {
        result.delete(key)
      } else {
        result.set(key, value)
      }
    }
    return result
  }
  // TODO: Make this strongly-typed (no `any`).
  const deepMerge = (...sources) => {
    let returnValue = {}
    let headers = {}
    for (const source of sources) {
      if (Array.isArray(source)) {
        if (!Array.isArray(returnValue)) {
          returnValue = []
        }
        returnValue = [...returnValue, ...source]
      } else if (isObject$1(source)) {
        for (let [key, value] of Object.entries(source)) {
          if (isObject$1(value) && key in returnValue) {
            value = deepMerge(returnValue[key], value)
          }
          returnValue = { ...returnValue, [key]: value }
        }
        if (isObject$1(source.headers)) {
          headers = mergeHeaders(headers, source.headers)
          returnValue.headers = headers
        }
      }
    }
    return returnValue
  }

  const supportsRequestStreams = (() => {
    let duplexAccessed = false
    let hasContentType = false
    const supportsReadableStream =
      typeof globalThis.ReadableStream === 'function'
    const supportsRequest = typeof globalThis.Request === 'function'
    if (supportsReadableStream && supportsRequest) {
      hasContentType = new globalThis.Request('https://empty.invalid', {
        body: new globalThis.ReadableStream(),
        method: 'POST',
        // @ts-expect-error - Types are outdated.
        get duplex () {
          duplexAccessed = true
          return 'half'
        }
      }).headers.has('Content-Type')
    }
    return duplexAccessed && !hasContentType
  })()
  const supportsAbortController =
    typeof globalThis.AbortController === 'function'
  const supportsResponseStreams =
    typeof globalThis.ReadableStream === 'function'
  const supportsFormData = typeof globalThis.FormData === 'function'
  const requestMethods = ['get', 'post', 'put', 'patch', 'head', 'delete']
  const responseTypes = {
    json: 'application/json',
    text: 'text/*',
    formData: 'multipart/form-data',
    arrayBuffer: '*/*',
    blob: '*/*'
  }
  // The maximum value of a 32bit int (see issue #117)
  const maxSafeTimeout = 2_147_483_647
  const stop = Symbol('stop')
  const kyOptionKeys = {
    json: true,
    parseJson: true,
    searchParams: true,
    prefixUrl: true,
    retry: true,
    timeout: true,
    hooks: true,
    throwHttpErrors: true,
    onDownloadProgress: true,
    fetch: true
  }
  const requestOptionsRegistry = {
    method: true,
    headers: true,
    body: true,
    mode: true,
    credentials: true,
    cache: true,
    redirect: true,
    referrer: true,
    referrerPolicy: true,
    integrity: true,
    keepalive: true,
    signal: true,
    window: true,
    dispatcher: true,
    duplex: true,
    priority: true
  }

  const normalizeRequestMethod = input =>
    requestMethods.includes(input) ? input.toUpperCase() : input
  const retryMethods = ['get', 'put', 'head', 'delete', 'options', 'trace']
  const retryStatusCodes = [408, 413, 429, 500, 502, 503, 504]
  const retryAfterStatusCodes = [413, 429, 503]
  const defaultRetryOptions = {
    limit: 2,
    methods: retryMethods,
    statusCodes: retryStatusCodes,
    afterStatusCodes: retryAfterStatusCodes,
    maxRetryAfter: Number.POSITIVE_INFINITY,
    backoffLimit: Number.POSITIVE_INFINITY,
    delay: attemptCount => 0.3 * 2 ** (attemptCount - 1) * 1000
  }
  const normalizeRetryOptions = (retry = {}) => {
    if (typeof retry === 'number') {
      return {
        ...defaultRetryOptions,
        limit: retry
      }
    }
    if (retry.methods && !Array.isArray(retry.methods)) {
      throw new Error('retry.methods must be an array')
    }
    if (retry.statusCodes && !Array.isArray(retry.statusCodes)) {
      throw new Error('retry.statusCodes must be an array')
    }
    return {
      ...defaultRetryOptions,
      ...retry,
      afterStatusCodes: retryAfterStatusCodes
    }
  }

  // `Promise.race()` workaround (#91)
  async function timeout (request, init, abortController, options) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (abortController) {
          abortController.abort()
        }
        reject(new TimeoutError(request))
      }, options.timeout)
      void options
        .fetch(request, init)
        .then(resolve)
        .catch(reject)
        .then(() => {
          clearTimeout(timeoutId)
        })
    })
  }

  // https://github.com/sindresorhus/delay/tree/ab98ae8dfcb38e1593286c94d934e70d14a4e111
  async function delay (ms, { signal }) {
    return new Promise((resolve, reject) => {
      if (signal) {
        signal.throwIfAborted()
        signal.addEventListener('abort', abortHandler, { once: true })
      }
      function abortHandler () {
        clearTimeout(timeoutId)
        reject(signal.reason)
      }
      const timeoutId = setTimeout(() => {
        signal?.removeEventListener('abort', abortHandler)
        resolve()
      }, ms)
    })
  }

  const findUnknownOptions = (request, options) => {
    const unknownOptions = {}
    for (const key in options) {
      if (
        !(key in requestOptionsRegistry) &&
        !(key in kyOptionKeys) &&
        !(key in request)
      ) {
        unknownOptions[key] = options[key]
      }
    }
    return unknownOptions
  }

  class Ky {
    static create (input, options) {
      const ky = new Ky(input, options)
      const function_ = async () => {
        if (
          typeof ky._options.timeout === 'number' &&
          ky._options.timeout > maxSafeTimeout
        ) {
          throw new RangeError(
            `The \`timeout\` option cannot be greater than ${maxSafeTimeout}`
          )
        }
        // Delay the fetch so that body method shortcuts can set the Accept header
        await Promise.resolve()
        let response = await ky._fetch()
        for (const hook of ky._options.hooks.afterResponse) {
          // eslint-disable-next-line no-await-in-loop
          const modifiedResponse = await hook(
            ky.request,
            ky._options,
            ky._decorateResponse(response.clone())
          )
          if (modifiedResponse instanceof globalThis.Response) {
            response = modifiedResponse
          }
        }
        ky._decorateResponse(response)
        if (!response.ok && ky._options.throwHttpErrors) {
          let error = new HTTPError(response, ky.request, ky._options)
          for (const hook of ky._options.hooks.beforeError) {
            // eslint-disable-next-line no-await-in-loop
            error = await hook(error)
          }
          throw error
        }
        // If `onDownloadProgress` is passed, it uses the stream API internally
        /* istanbul ignore next */
        if (ky._options.onDownloadProgress) {
          if (typeof ky._options.onDownloadProgress !== 'function') {
            throw new TypeError(
              'The `onDownloadProgress` option must be a function'
            )
          }
          if (!supportsResponseStreams) {
            throw new Error(
              'Streams are not supported in your environment. `ReadableStream` is missing.'
            )
          }
          return ky._stream(response.clone(), ky._options.onDownloadProgress)
        }
        return response
      }
      const isRetriableMethod = ky._options.retry.methods.includes(
        ky.request.method.toLowerCase()
      )
      const result = isRetriableMethod ? ky._retry(function_) : function_()
      for (const [type, mimeType] of Object.entries(responseTypes)) {
        result[type] = async () => {
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          ky.request.headers.set(
            'accept',
            ky.request.headers.get('accept') || mimeType
          )
          const awaitedResult = await result
          const response = awaitedResult.clone()
          if (type === 'json') {
            if (response.status === 204) {
              return ''
            }
            const arrayBuffer = await response.clone().arrayBuffer()
            const responseSize = arrayBuffer.byteLength
            if (responseSize === 0) {
              return ''
            }
            if (options.parseJson) {
              return options.parseJson(await response.text())
            }
          }
          return response[type]()
        }
      }
      return result
    }
    // eslint-disable-next-line complexity
    constructor (input, options = {}) {
      Object.defineProperty(this, 'request', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      })
      Object.defineProperty(this, 'abortController', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      })
      Object.defineProperty(this, '_retryCount', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
      })
      Object.defineProperty(this, '_input', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      })
      Object.defineProperty(this, '_options', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      })
      this._input = input
      const credentials =
        this._input instanceof Request && 'credentials' in Request.prototype
          ? this._input.credentials
          : undefined
      this._options = {
        ...(credentials && { credentials }), // For exactOptionalPropertyTypes
        ...options,
        headers: mergeHeaders(this._input.headers, options.headers),
        hooks: deepMerge(
          {
            beforeRequest: [],
            beforeRetry: [],
            beforeError: [],
            afterResponse: []
          },
          options.hooks
        ),
        method: normalizeRequestMethod(options.method ?? this._input.method),
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        prefixUrl: String(options.prefixUrl || ''),
        retry: normalizeRetryOptions(options.retry),
        throwHttpErrors: options.throwHttpErrors !== false,
        timeout: options.timeout ?? 10_000,
        fetch: options.fetch ?? globalThis.fetch.bind(globalThis)
      }
      if (
        typeof this._input !== 'string' &&
        !(
          this._input instanceof URL ||
          this._input instanceof globalThis.Request
        )
      ) {
        throw new TypeError('`input` must be a string, URL, or Request')
      }
      if (this._options.prefixUrl && typeof this._input === 'string') {
        if (this._input.startsWith('/')) {
          throw new Error(
            '`input` must not begin with a slash when using `prefixUrl`'
          )
        }
        if (!this._options.prefixUrl.endsWith('/')) {
          this._options.prefixUrl += '/'
        }
        this._input = this._options.prefixUrl + this._input
      }
      if (supportsAbortController) {
        this.abortController = new globalThis.AbortController()
        if (this._options.signal) {
          const originalSignal = this._options.signal
          this._options.signal.addEventListener('abort', () => {
            this.abortController.abort(originalSignal.reason)
          })
        }
        this._options.signal = this.abortController.signal
      }
      if (supportsRequestStreams) {
        // @ts-expect-error - Types are outdated.
        this._options.duplex = 'half'
      }
      this.request = new globalThis.Request(this._input, this._options)
      if (this._options.searchParams) {
        // eslint-disable-next-line unicorn/prevent-abbreviations
        const textSearchParams =
          typeof this._options.searchParams === 'string'
            ? this._options.searchParams.replace(/^\?/, '')
            : new URLSearchParams(this._options.searchParams).toString()
        // eslint-disable-next-line unicorn/prevent-abbreviations
        const searchParams = '?' + textSearchParams
        const url = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, searchParams)
        // To provide correct form boundary, Content-Type header should be deleted each time when new Request instantiated from another one
        if (
          ((supportsFormData &&
            this._options.body instanceof globalThis.FormData) ||
            this._options.body instanceof URLSearchParams) &&
          !(this._options.headers && this._options.headers['content-type'])
        ) {
          this.request.headers.delete('content-type')
        }
        // The spread of `this.request` is required as otherwise it misses the `duplex` option for some reason and throws.
        this.request = new globalThis.Request(
          new globalThis.Request(url, { ...this.request }),
          this._options
        )
      }
      if (this._options.json !== undefined) {
        this._options.body = JSON.stringify(this._options.json)
        this.request.headers.set(
          'content-type',
          this._options.headers.get('content-type') ?? 'application/json'
        )
        this.request = new globalThis.Request(this.request, {
          body: this._options.body
        })
      }
    }
    _calculateRetryDelay (error) {
      this._retryCount++
      if (
        this._retryCount <= this._options.retry.limit &&
        !(error instanceof TimeoutError)
      ) {
        if (error instanceof HTTPError) {
          if (
            !this._options.retry.statusCodes.includes(error.response.status)
          ) {
            return 0
          }
          const retryAfter = error.response.headers.get('Retry-After')
          if (
            retryAfter &&
            this._options.retry.afterStatusCodes.includes(error.response.status)
          ) {
            let after = Number(retryAfter)
            if (Number.isNaN(after)) {
              after = Date.parse(retryAfter) - Date.now()
            } else {
              after *= 1000
            }
            if (
              this._options.retry.maxRetryAfter !== undefined &&
              after > this._options.retry.maxRetryAfter
            ) {
              return 0
            }
            return after
          }
          if (error.response.status === 413) {
            return 0
          }
        }
        const retryDelay = this._options.retry.delay(this._retryCount)
        return Math.min(this._options.retry.backoffLimit, retryDelay)
      }
      return 0
    }
    _decorateResponse (response) {
      if (this._options.parseJson) {
        response.json = async () =>
          this._options.parseJson(await response.text())
      }
      return response
    }
    async _retry (function_) {
      try {
        return await function_()
      } catch (error) {
        const ms = Math.min(this._calculateRetryDelay(error), maxSafeTimeout)
        if (ms !== 0 && this._retryCount > 0) {
          await delay(ms, { signal: this._options.signal })
          for (const hook of this._options.hooks.beforeRetry) {
            // eslint-disable-next-line no-await-in-loop
            const hookResult = await hook({
              request: this.request,
              options: this._options,
              error: error,
              retryCount: this._retryCount
            })
            // If `stop` is returned from the hook, the retry process is stopped
            if (hookResult === stop) {
              return
            }
          }
          return this._retry(function_)
        }
        throw error
      }
    }
    async _fetch () {
      for (const hook of this._options.hooks.beforeRequest) {
        // eslint-disable-next-line no-await-in-loop
        const result = await hook(this.request, this._options)
        if (result instanceof Request) {
          this.request = result
          break
        }
        if (result instanceof Response) {
          return result
        }
      }
      const nonRequestOptions = findUnknownOptions(this.request, this._options)
      if (this._options.timeout === false) {
        return this._options.fetch(this.request.clone(), nonRequestOptions)
      }
      return timeout(
        this.request.clone(),
        nonRequestOptions,
        this.abortController,
        this._options
      )
    }
    /* istanbul ignore next */
    _stream (response, onDownloadProgress) {
      const totalBytes = Number(response.headers.get('content-length')) || 0
      let transferredBytes = 0
      if (response.status === 204) {
        if (onDownloadProgress) {
          onDownloadProgress(
            { percent: 1, totalBytes, transferredBytes },
            new Uint8Array()
          )
        }
        return new globalThis.Response(null, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        })
      }
      return new globalThis.Response(
        new globalThis.ReadableStream({
          async start (controller) {
            const reader = response.body.getReader()
            if (onDownloadProgress) {
              onDownloadProgress(
                { percent: 0, transferredBytes: 0, totalBytes },
                new Uint8Array()
              )
            }
            async function read () {
              const { done, value } = await reader.read()
              if (done) {
                controller.close()
                return
              }
              if (onDownloadProgress) {
                transferredBytes += value.byteLength
                const percent =
                  totalBytes === 0 ? 0 : transferredBytes / totalBytes
                onDownloadProgress(
                  { percent, transferredBytes, totalBytes },
                  value
                )
              }
              controller.enqueue(value)
              await read()
            }
            await read()
          }
        }),
        {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        }
      )
    }
  }

  /*! MIT License © Sindre Sorhus */
  const createInstance = defaults => {
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    const ky = (input, options) =>
      Ky.create(input, validateAndMerge(defaults, options))
    for (const method of requestMethods) {
      // eslint-disable-next-line @typescript-eslint/promise-function-async
      ky[method] = (input, options) =>
        Ky.create(input, validateAndMerge(defaults, options, { method }))
    }
    ky.create = newDefaults => createInstance(validateAndMerge(newDefaults))
    ky.extend = newDefaults =>
      createInstance(validateAndMerge(defaults, newDefaults))
    ky.stop = stop
    return ky
  }
  const ky$1 = createInstance()

  var distribution = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    HTTPError: HTTPError,
    TimeoutError: TimeoutError,
    default: ky$1
  })

  var require$$2 = /*@__PURE__*/ getAugmentedNamespace(distribution)

  const ENDPOINT = {
    FREE: 'https://api.microlink.io/',
    PRO: 'https://pro.microlink.io/'
  }

  const isObject = input => input !== null && typeof input === 'object'

  const isBuffer = input =>
    input != null &&
    input.constructor != null &&
    typeof input.constructor.isBuffer === 'function' &&
    input.constructor.isBuffer(input)

  const parseBody = (input, error, url) => {
    try {
      return JSON.parse(input)
    } catch (_) {
      const message = input || error.message

      return {
        status: 'error',
        data: { url: message },
        more: 'https://microlink.io/efatalclient',
        code: 'EFATALCLIENT',
        message,
        url
      }
    }
  }

  const factory$1 = streamResponseType => ({
    VERSION,
    MicrolinkError,
    urlHttp,
    got,
    flatten
  }) => {
    const assertUrl = (url = '') => {
      if (!urlHttp(url)) {
        const message = `The \`url\` as \`${url}\` is not valid. Ensure it has protocol (http or https) and hostname.`
        throw new MicrolinkError({
          status: 'fail',
          data: { url: message },
          more: 'https://microlink.io/einvalurlclient',
          code: 'EINVALURLCLIENT',
          message,
          url
        })
      }
    }

    const mapRules = rules => {
      if (!isObject(rules)) return
      const flatRules = flatten(rules)
      return Object.keys(flatRules).reduce((acc, key) => {
        acc[`data.${key}`] = flatRules[key].toString()
        return acc
      }, {})
    }

    const fetchFromApi = async (apiUrl, opts = {}) => {
      try {
        const response = await got(apiUrl, opts)
        return opts.responseType === streamResponseType
          ? response
          : { ...response.body, response }
      } catch (error) {
        const { response = {} } = error
        const {
          statusCode,
          body: rawBody,
          headers = {},
          url: uri = apiUrl
        } = response
        const isBodyBuffer = isBuffer(rawBody)

        const body =
          isObject(rawBody) && !isBodyBuffer
            ? rawBody
            : parseBody(isBodyBuffer ? rawBody.toString() : rawBody, error, uri)

        throw new MicrolinkError({
          ...body,
          message: body.message,
          url: uri,
          statusCode,
          headers
        })
      }
    }

    const getApiUrl = (
      url,
      { data, apiKey, endpoint, retry, cache, ...opts } = {},
      { responseType = 'json', headers: gotHeaders, ...gotOpts } = {}
    ) => {
      const isPro = !!apiKey
      const apiEndpoint = endpoint || ENDPOINT[isPro ? 'PRO' : 'FREE']

      const apiUrl = `${apiEndpoint}?${new URLSearchParams({
        url,
        ...mapRules(data),
        ...flatten(opts)
      }).toString()}`

      const headers = isPro
        ? { ...gotHeaders, 'x-api-key': apiKey }
        : { ...gotHeaders }

      if (opts.stream) {
        responseType = streamResponseType
      }
      return [apiUrl, { ...gotOpts, responseType, cache, retry, headers }]
    }

    const createMql = defaultOpts => async (url, opts, gotOpts) => {
      assertUrl(url)
      const [apiUrl, fetchOpts] = getApiUrl(url, opts, {
        ...defaultOpts,
        ...gotOpts
      })
      return fetchFromApi(apiUrl, fetchOpts)
    }

    const mql = createMql()
    mql.extend = createMql
    mql.MicrolinkError = MicrolinkError
    mql.getApiUrl = getApiUrl
    mql.fetchFromApi = fetchFromApi
    mql.mapRules = mapRules
    mql.version = VERSION
    mql.stream = got.stream

    return mql
  }

  var factory_1 = factory$1

  const urlHttp = lightweight$1
  const { flattie: flatten } = dist
  const { default: ky } = require$$2

  const factory = factory_1('arrayBuffer')

  class MicrolinkError extends Error {
    constructor (props) {
      super()
      this.name = 'MicrolinkError'
      Object.assign(this, props)
      this.description = this.message
      this.message = this.code
        ? `${this.code}, ${this.description}`
        : this.description
    }
  }

  const got = async (url, { responseType, ...opts }) => {
    try {
      if (opts.timeout === undefined) opts.timeout = false
      const response = await ky(url, opts)
      const body = await response[responseType]()
      const { headers, status: statusCode } = response
      return { url: response.url, body, headers, statusCode }
    } catch (error) {
      if (error.response) {
        const { response } = error
        error.response = {
          ...response,
          headers: Array.from(response.headers.entries()).reduce(
            (acc, [key, value]) => {
              acc[key] = value
              return acc
            },
            {}
          ),
          statusCode: response.status,
          body: await response.text()
        }
      }
      throw error
    }
  }

  got.stream = (...args) => ky(...args).then(res => res.body)

  const mql = factory({
    MicrolinkError,
    urlHttp,
    got,
    flatten,
    VERSION: '0.13.6'
  })

  lightweight$2.exports = mql
  var arrayBuffer = (lightweight$2.exports.arrayBuffer = mql.extend({
    responseType: 'arrayBuffer'
  }))
  var extend = (lightweight$2.exports.extend = mql.extend)
  var fetchFromApi = (lightweight$2.exports.fetchFromApi = mql.fetchFromApi)
  var getApiUrl = (lightweight$2.exports.getApiUrl = mql.getApiUrl)
  var mapRules = (lightweight$2.exports.mapRules = mql.mapRules)
  var MicrolinkError_1 = (lightweight$2.exports.MicrolinkError =
    mql.MicrolinkError)
  var version = (lightweight$2.exports.version = mql.version)

  var lightweightExports = lightweight$2.exports
  var lightweight = /*@__PURE__*/ getDefaultExportFromCjs(lightweightExports)

  exports.MicrolinkError = MicrolinkError_1
  exports.arrayBuffer = arrayBuffer
  exports.default = lightweight
  exports.extend = extend
  exports.fetchFromApi = fetchFromApi
  exports.getApiUrl = getApiUrl
  exports.mapRules = mapRules
  exports.version = version

  Object.defineProperty(exports, '__esModule', { value: true })
})
