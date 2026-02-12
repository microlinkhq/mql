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
    if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n
    var f = n.default
    if (typeof f == 'function') {
      var a = function a () {
        var isInstance = false
        try {
          isInstance = this instanceof a
        } catch {}
        if (isInstance) {
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

  var lightweight = { exports: {} }

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

  class HTTPError extends Error {
    response
    request
    options
    constructor (response, request, options) {
      const code =
        response.status || response.status === 0 ? response.status : ''
      const title = response.statusText ?? ''
      const status = `${code} ${title}`.trim()
      const reason = status ? `status code ${status}` : 'an unknown error'
      super(`Request failed with ${reason}: ${request.method} ${request.url}`)
      this.name = 'HTTPError'
      this.response = response
      this.request = request
      this.options = options
    }
  }

  /**
	Wrapper for non-Error values that were thrown.

	In JavaScript, any value can be thrown (not just Error instances). This class wraps such values to ensure consistent error handling.
	*/
  class NonError extends Error {
    name = 'NonError'
    value
    constructor (value) {
      let message = 'Non-error value was thrown'
      // Intentionally minimal as this error is just an edge-case.
      try {
        if (typeof value === 'string') {
          message = value
        } else if (
          value &&
          typeof value === 'object' &&
          'message' in value &&
          typeof value.message === 'string'
        ) {
          message = value.message
        }
      } catch {
        // Use default message if accessing properties throws
      }
      super(message)
      this.value = value
    }
  }

  /**
	Internal error used to signal a forced retry from afterResponse hooks.
	This is thrown when a user returns ky.retry() from an afterResponse hook.
	*/
  class ForceRetryError extends Error {
    name = 'ForceRetryError'
    customDelay
    code
    customRequest
    constructor (options) {
      // Runtime protection: wrap non-Error causes in NonError
      // TypeScript type is Error for guidance, but JS users can pass anything
      const cause = options?.cause
        ? options.cause instanceof Error
          ? options.cause
          : new NonError(options.cause)
        : undefined
      super(
        options?.code ? `Forced retry: ${options.code}` : 'Forced retry',
        cause ? { cause } : undefined
      )
      this.customDelay = options?.delay
      this.code = options?.code
      this.customRequest = options?.request
    }
  }

  const supportsRequestStreams = (() => {
    let duplexAccessed = false
    let hasContentType = false
    const supportsReadableStream =
      typeof globalThis.ReadableStream === 'function'
    const supportsRequest = typeof globalThis.Request === 'function'
    if (supportsReadableStream && supportsRequest) {
      try {
        hasContentType = new globalThis.Request('https://empty.invalid', {
          body: new globalThis.ReadableStream(),
          method: 'POST',
          // @ts-expect-error - Types are outdated.
          get duplex () {
            duplexAccessed = true
            return 'half'
          }
        }).headers.has('Content-Type')
      } catch (error) {
        // QQBrowser on iOS throws "unsupported BodyInit type" error (see issue #581)
        if (
          error instanceof Error &&
          error.message === 'unsupported BodyInit type'
        ) {
          return false
        }
        throw error
      }
    }
    return duplexAccessed && !hasContentType
  })()
  const supportsAbortController =
    typeof globalThis.AbortController === 'function'
  const supportsAbortSignal =
    typeof globalThis.AbortSignal === 'function' &&
    typeof globalThis.AbortSignal.any === 'function'
  const supportsResponseStreams =
    typeof globalThis.ReadableStream === 'function'
  const supportsFormData = typeof globalThis.FormData === 'function'
  const requestMethods = ['get', 'post', 'put', 'patch', 'head', 'delete']
  const responseTypes = {
    json: 'application/json',
    text: 'text/*',
    formData: 'multipart/form-data',
    arrayBuffer: '*/*',
    blob: '*/*',
    // Supported in modern Fetch implementations (for example, browsers and recent Node.js/undici).
    // We still feature-check at runtime before exposing the shortcut.
    bytes: '*/*'
  }
  // The maximum value of a 32bit int (see issue #117)
  const maxSafeTimeout = 2_147_483_647
  // Size in bytes of a typical form boundary, used to help estimate upload size
  const usualFormBoundarySize = new TextEncoder().encode(
    '------WebKitFormBoundaryaxpyiPgbbPti10Rw'
  ).length
  const stop = Symbol('stop')
  /**
	Marker returned by ky.retry() to signal a forced retry from afterResponse hooks.
	*/
  class RetryMarker {
    options
    constructor (options) {
      this.options = options
    }
  }
  /**
	Force a retry from an `afterResponse` hook.

	This allows you to retry a request based on the response content, even if the response has a successful status code. The retry will respect the `retry.limit` option and skip the `shouldRetry` check. The forced retry is observable in `beforeRetry` hooks, where the error will be a `ForceRetryError`.

	@param options - Optional configuration for the retry.

	@example
	```
	import ky, {isForceRetryError} from 'ky';

	const api = ky.extend({
	    hooks: {
	        afterResponse: [
	            async (request, options, response) => {
	                // Retry based on response body content
	                if (response.status === 200) {
	                    const data = await response.clone().json();

	                    // Simple retry with default delay
	                    if (data.error?.code === 'TEMPORARY_ERROR') {
	                        return ky.retry();
	                    }

	                    // Retry with custom delay from API response
	                    if (data.error?.code === 'RATE_LIMIT') {
	                        return ky.retry({
	                            delay: data.error.retryAfter * 1000,
	                            code: 'RATE_LIMIT'
	                        });
	                    }

	                    // Retry with a modified request (e.g., fallback endpoint)
	                    if (data.error?.code === 'FALLBACK_TO_BACKUP') {
	                        return ky.retry({
	                            request: new Request('https://backup-api.com/endpoint', {
	                                method: request.method,
	                                headers: request.headers,
	                            }),
	                            code: 'BACKUP_ENDPOINT'
	                        });
	                    }

	                    // Retry with refreshed authentication
	                    if (data.error?.code === 'TOKEN_REFRESH' && data.newToken) {
	                        return ky.retry({
	                            request: new Request(request, {
	                                headers: {
	                                    ...Object.fromEntries(request.headers),
	                                    'Authorization': `Bearer ${data.newToken}`
	                                }
	                            }),
	                            code: 'TOKEN_REFRESHED'
	                        });
	                    }

	                    // Retry with cause to preserve error chain
	                    try {
	                        validateResponse(data);
	                    } catch (error) {
	                        return ky.retry({
	                            code: 'VALIDATION_FAILED',
	                            cause: error
	                        });
	                    }
	                }
	            }
	        ],
	        beforeRetry: [
	            ({error, retryCount}) => {
	                // Observable in beforeRetry hooks
	                if (isForceRetryError(error)) {
	                    console.log(`Forced retry #${retryCount}: ${error.message}`);
	                    // Example output: "Forced retry #1: Forced retry: RATE_LIMIT"
	                }
	            }
	        ]
	    }
	});

	const response = await api.get('https://example.com/api');
	```
	*/
  const retry = options => new RetryMarker(options)
  const kyOptionKeys = {
    json: true,
    parseJson: true,
    stringifyJson: true,
    searchParams: true,
    prefixUrl: true,
    retry: true,
    timeout: true,
    hooks: true,
    throwHttpErrors: true,
    onDownloadProgress: true,
    onUploadProgress: true,
    fetch: true,
    context: true
  }
  // Vendor-specific fetch options that should always be passed to fetch()
  // even if they appear on the Request object due to vendor patching.
  // See: https://github.com/sindresorhus/ky/issues/541
  const vendorSpecificOptions = {
    next: true // Next.js cache revalidation (revalidate, tags)
  }
  // Standard RequestInit options that should NOT be passed separately to fetch()
  // because they're already applied to the Request object.
  // Note: `dispatcher` and `priority` are NOT included here - they're fetch-only
  // options that the Request constructor doesn't accept, so they need to be passed
  // separately to fetch().
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
    duplex: true
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  const getBodySize = body => {
    if (!body) {
      return 0
    }
    if (body instanceof FormData) {
      // This is an approximation, as FormData size calculation is not straightforward
      let size = 0
      for (const [key, value] of body) {
        size += usualFormBoundarySize
        size += new TextEncoder().encode(
          `Content-Disposition: form-data; name="${key}"`
        ).length
        size +=
          typeof value === 'string'
            ? new TextEncoder().encode(value).length
            : value.size
      }
      return size
    }
    if (body instanceof Blob) {
      return body.size
    }
    if (body instanceof ArrayBuffer) {
      return body.byteLength
    }
    if (typeof body === 'string') {
      return new TextEncoder().encode(body).length
    }
    if (body instanceof URLSearchParams) {
      return new TextEncoder().encode(body.toString()).length
    }
    if ('byteLength' in body) {
      return body.byteLength
    }
    if (typeof body === 'object' && body !== null) {
      try {
        const jsonString = JSON.stringify(body)
        return new TextEncoder().encode(jsonString).length
      } catch {
        return 0
      }
    }
    return 0 // Default case, unable to determine size
  }
  const withProgress = (stream, totalBytes, onProgress) => {
    let previousChunk
    let transferredBytes = 0
    return stream.pipeThrough(
      new TransformStream({
        transform (currentChunk, controller) {
          controller.enqueue(currentChunk)
          if (previousChunk) {
            transferredBytes += previousChunk.byteLength
            let percent = totalBytes === 0 ? 0 : transferredBytes / totalBytes
            // Avoid reporting 100% progress before the stream is actually finished (in case totalBytes is inaccurate)
            if (percent >= 1) {
              // Epsilon is used here to get as close as possible to 100% without reaching it.
              // If we were to use 0.99 here, percent could potentially go backwards.
              percent = 1 - Number.EPSILON
            }
            onProgress?.(
              {
                percent,
                totalBytes: Math.max(totalBytes, transferredBytes),
                transferredBytes
              },
              previousChunk
            )
          }
          previousChunk = currentChunk
        },
        flush () {
          if (previousChunk) {
            transferredBytes += previousChunk.byteLength
            onProgress?.(
              {
                percent: 1,
                totalBytes: Math.max(totalBytes, transferredBytes),
                transferredBytes
              },
              previousChunk
            )
          }
        }
      })
    )
  }
  const streamResponse = (response, onDownloadProgress) => {
    if (!response.body) {
      return response
    }
    if (response.status === 204) {
      return new Response(null, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      })
    }
    const totalBytes = Math.max(
      0,
      Number(response.headers.get('content-length')) || 0
    )
    return new Response(
      withProgress(response.body, totalBytes, onDownloadProgress),
      {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      }
    )
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  const streamRequest = (request, onUploadProgress, originalBody) => {
    if (!request.body) {
      return request
    }
    // Use original body for size calculation since request.body is already a stream
    const totalBytes = getBodySize(originalBody ?? request.body)
    return new Request(request, {
      // @ts-expect-error - Types are outdated.
      duplex: 'half',
      body: withProgress(request.body, totalBytes, onUploadProgress)
    })
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
  function newHookValue (original, incoming, property) {
    return Object.hasOwn(incoming, property) && incoming[property] === undefined
      ? []
      : deepMerge(original[property] ?? [], incoming[property] ?? [])
  }
  const mergeHooks = (original = {}, incoming = {}) => ({
    beforeRequest: newHookValue(original, incoming, 'beforeRequest'),
    beforeRetry: newHookValue(original, incoming, 'beforeRetry'),
    afterResponse: newHookValue(original, incoming, 'afterResponse'),
    beforeError: newHookValue(original, incoming, 'beforeError')
  })
  const appendSearchParameters = (target, source) => {
    const result = new URLSearchParams()
    for (const input of [target, source]) {
      if (input === undefined) {
        continue
      }
      if (input instanceof URLSearchParams) {
        for (const [key, value] of input.entries()) {
          result.append(key, value)
        }
      } else if (Array.isArray(input)) {
        for (const pair of input) {
          if (!Array.isArray(pair) || pair.length !== 2) {
            throw new TypeError(
              'Array search parameters must be provided in [[key, value], ...] format'
            )
          }
          result.append(String(pair[0]), String(pair[1]))
        }
      } else if (isObject$1(input)) {
        for (const [key, value] of Object.entries(input)) {
          if (value !== undefined) {
            result.append(key, String(value))
          }
        }
      } else {
        // String
        const parameters = new URLSearchParams(input)
        for (const [key, value] of parameters.entries()) {
          result.append(key, value)
        }
      }
    }
    return result
  }
  // TODO: Make this strongly-typed (no `any`).
  const deepMerge = (...sources) => {
    let returnValue = {}
    let headers = {}
    let hooks = {}
    let searchParameters
    const signals = []
    for (const source of sources) {
      if (Array.isArray(source)) {
        if (!Array.isArray(returnValue)) {
          returnValue = []
        }
        returnValue = [...returnValue, ...source]
      } else if (isObject$1(source)) {
        for (let [key, value] of Object.entries(source)) {
          // Special handling for AbortSignal instances
          if (key === 'signal' && value instanceof globalThis.AbortSignal) {
            signals.push(value)
            continue
          }
          // Special handling for context - shallow merge only
          if (key === 'context') {
            if (
              value !== undefined &&
              value !== null &&
              (!isObject$1(value) || Array.isArray(value))
            ) {
              throw new TypeError('The `context` option must be an object')
            }
            // Shallow merge: always create a new object to prevent mutation bugs
            returnValue = {
              ...returnValue,
              context:
                value === undefined || value === null
                  ? {}
                  : { ...returnValue.context, ...value }
            }
            continue
          }
          // Special handling for searchParams
          if (key === 'searchParams') {
            if (value === undefined || value === null) {
              // Explicit undefined or null removes searchParams
              searchParameters = undefined
            } else {
              // First source: keep as-is to preserve type (string/object/URLSearchParams)
              // Subsequent sources: merge and convert to URLSearchParams
              searchParameters =
                searchParameters === undefined
                  ? value
                  : appendSearchParameters(searchParameters, value)
            }
            continue
          }
          if (isObject$1(value) && key in returnValue) {
            value = deepMerge(returnValue[key], value)
          }
          returnValue = { ...returnValue, [key]: value }
        }
        if (isObject$1(source.hooks)) {
          hooks = mergeHooks(hooks, source.hooks)
          returnValue.hooks = hooks
        }
        if (isObject$1(source.headers)) {
          headers = mergeHeaders(headers, source.headers)
          returnValue.headers = headers
        }
      }
    }
    if (searchParameters !== undefined) {
      returnValue.searchParams = searchParameters
    }
    if (signals.length > 0) {
      if (signals.length === 1) {
        returnValue.signal = signals[0]
      } else if (supportsAbortSignal) {
        returnValue.signal = AbortSignal.any(signals)
      } else {
        // When AbortSignal.any is not available, use the last signal
        // This maintains the previous behavior before signal merging was added
        // This can be remove when the `supportsAbortSignal` check is removed.`
        returnValue.signal = signals.at(-1)
      }
    }
    if (returnValue.context === undefined) {
      returnValue.context = {}
    }
    return returnValue
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
    delay: attemptCount => 0.3 * 2 ** (attemptCount - 1) * 1000,
    jitter: undefined,
    retryOnTimeout: false
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
    retry.methods &&= retry.methods.map(method => method.toLowerCase())
    if (retry.statusCodes && !Array.isArray(retry.statusCodes)) {
      throw new Error('retry.statusCodes must be an array')
    }
    const normalizedRetry = Object.fromEntries(
      Object.entries(retry).filter(([, value]) => value !== undefined)
    )
    return {
      ...defaultRetryOptions,
      ...normalizedRetry
    }
  }

  class TimeoutError extends Error {
    request
    constructor (request) {
      super(`Request timed out: ${request.method} ${request.url}`)
      this.name = 'TimeoutError'
      this.request = request
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
      // Skip inherited properties
      if (!Object.hasOwn(options, key)) {
        continue
      }
      // An option is passed to fetch() if:
      // 1. It's not a standard RequestInit option (not in requestOptionsRegistry)
      // 2. It's not a ky-specific option (not in kyOptionKeys)
      // 3. Either:
      //    a. It's not on the Request object, OR
      //    b. It's a vendor-specific option that should always be passed (in vendorSpecificOptions)
      if (
        !(key in requestOptionsRegistry) &&
        !(key in kyOptionKeys) &&
        (!(key in request) || key in vendorSpecificOptions)
      ) {
        unknownOptions[key] = options[key]
      }
    }
    return unknownOptions
  }
  const hasSearchParameters = search => {
    if (search === undefined) {
      return false
    }
    // The `typeof array` still gives "object", so we need different checking for array.
    if (Array.isArray(search)) {
      return search.length > 0
    }
    if (search instanceof URLSearchParams) {
      return search.size > 0
    }
    // Record
    if (typeof search === 'object') {
      return Object.keys(search).length > 0
    }
    if (typeof search === 'string') {
      return search.trim().length > 0
    }
    return Boolean(search)
  }

  /**
	Type guard to check if an error is a Ky error.

	@param error - The error to check
	@returns `true` if the error is a Ky error, `false` otherwise

	@example
	```
	import ky, {isKyError} from 'ky';
	try {
	    const response = await ky.get('/api/data');
	} catch (error) {
	    if (isKyError(error)) {
	        // Handle Ky-specific errors
	        console.log('Ky error occurred:', error.message);
	    } else {
	        // Handle other errors
	        console.log('Unknown error:', error);
	    }
	}
	```
	*/
  function isKyError (error) {
    return (
      isHTTPError(error) || isTimeoutError(error) || isForceRetryError(error)
    )
  }
  /**
	Type guard to check if an error is an HTTPError.

	@param error - The error to check
	@returns `true` if the error is an HTTPError, `false` otherwise

	@example
	```
	import ky, {isHTTPError} from 'ky';
	try {
	    const response = await ky.get('/api/data');
	} catch (error) {
	    if (isHTTPError(error)) {
	        console.log('HTTP error status:', error.response.status);
	    }
	}
	```
	*/
  function isHTTPError (error) {
    return error instanceof HTTPError || error?.name === HTTPError.name
  }
  /**
	Type guard to check if an error is a TimeoutError.

	@param error - The error to check
	@returns `true` if the error is a TimeoutError, `false` otherwise

	@example
	```
	import ky, {isTimeoutError} from 'ky';
	try {
	    const response = await ky.get('/api/data', { timeout: 1000 });
	} catch (error) {
	    if (isTimeoutError(error)) {
	        console.log('Request timed out:', error.request.url);
	    }
	}
	```
	*/
  function isTimeoutError (error) {
    return error instanceof TimeoutError || error?.name === TimeoutError.name
  }
  /**
	Type guard to check if an error is a ForceRetryError.

	@param error - The error to check
	@returns `true` if the error is a ForceRetryError, `false` otherwise

	@example
	```
	import ky, {isForceRetryError} from 'ky';

	const api = ky.extend({
	    hooks: {
	        beforeRetry: [
	            ({error, retryCount}) => {
	                if (isForceRetryError(error)) {
	                    console.log(`Forced retry #${retryCount}: ${error.code}`);
	                }
	            }
	        ]
	    }
	});
	```
	*/
  function isForceRetryError (error) {
    return (
      error instanceof ForceRetryError || error?.name === ForceRetryError.name
    )
  }

  class Ky {
    static create (input, options) {
      const ky = new Ky(input, options)
      const function_ = async () => {
        if (
          typeof ky.#options.timeout === 'number' &&
          ky.#options.timeout > maxSafeTimeout
        ) {
          throw new RangeError(
            `The \`timeout\` option cannot be greater than ${maxSafeTimeout}`
          )
        }
        // Delay the fetch so that body method shortcuts can set the Accept header
        await Promise.resolve()
        // Before using ky.request, _fetch clones it and saves the clone for future retries to use.
        // If retry is not needed, close the cloned request's ReadableStream for memory safety.
        let response = await ky.#fetch()
        for (const hook of ky.#options.hooks.afterResponse) {
          // Clone the response before passing to hook so we can cancel it if needed
          const clonedResponse = ky.#decorateResponse(response.clone())
          let modifiedResponse
          try {
            // eslint-disable-next-line no-await-in-loop
            modifiedResponse = await hook(
              ky.request,
              ky.#getNormalizedOptions(),
              clonedResponse,
              { retryCount: ky.#retryCount }
            )
          } catch (error) {
            // Cancel both responses to prevent memory leaks when hook throws
            ky.#cancelResponseBody(clonedResponse)
            ky.#cancelResponseBody(response)
            throw error
          }
          if (modifiedResponse instanceof RetryMarker) {
            // Cancel both the cloned response passed to the hook and the current response to prevent resource leaks (especially important in Deno/Bun).
            // Do not await cancellation since hooks can clone the response, leaving extra tee branches that keep cancel promises pending per the Streams spec.
            ky.#cancelResponseBody(clonedResponse)
            ky.#cancelResponseBody(response)
            throw new ForceRetryError(modifiedResponse.options)
          }
          // Determine which response to use going forward
          const nextResponse =
            modifiedResponse instanceof globalThis.Response
              ? modifiedResponse
              : response
          // Cancel any response bodies we won't use to prevent memory leaks.
          // Uses fire-and-forget since hooks may have cloned the response, creating tee branches that block cancellation.
          if (clonedResponse !== nextResponse) {
            ky.#cancelResponseBody(clonedResponse)
          }
          if (response !== nextResponse) {
            ky.#cancelResponseBody(response)
          }
          response = nextResponse
        }
        ky.#decorateResponse(response)
        if (
          !response.ok &&
          (typeof ky.#options.throwHttpErrors === 'function'
            ? ky.#options.throwHttpErrors(response.status)
            : ky.#options.throwHttpErrors)
        ) {
          let error = new HTTPError(
            response,
            ky.request,
            ky.#getNormalizedOptions()
          )
          for (const hook of ky.#options.hooks.beforeError) {
            // eslint-disable-next-line no-await-in-loop
            error = await hook(error, { retryCount: ky.#retryCount })
          }
          throw error
        }
        // If `onDownloadProgress` is passed, it uses the stream API internally
        if (ky.#options.onDownloadProgress) {
          if (typeof ky.#options.onDownloadProgress !== 'function') {
            throw new TypeError(
              'The `onDownloadProgress` option must be a function'
            )
          }
          if (!supportsResponseStreams) {
            throw new Error(
              'Streams are not supported in your environment. `ReadableStream` is missing.'
            )
          }
          const progressResponse = response.clone()
          ky.#cancelResponseBody(response)
          return streamResponse(
            progressResponse,
            ky.#options.onDownloadProgress
          )
        }
        return response
      }
      // Always wrap in #retry to catch forced retries from afterResponse hooks
      // Method retriability is checked in #calculateRetryDelay for non-forced retries
      const result = ky.#retry(function_).finally(() => {
        const originalRequest = ky.#originalRequest
        // Ignore cancellation errors from already-locked or already-consumed streams.
        ky.#cancelBody(originalRequest?.body ?? undefined)
        ky.#cancelBody(ky.request.body ?? undefined)
      })
      for (const [type, mimeType] of Object.entries(responseTypes)) {
        // Only expose `.bytes()` when the environment implements it.
        if (
          type === 'bytes' &&
          typeof globalThis.Response?.prototype?.bytes !== 'function'
        ) {
          continue
        }
        result[type] = async () => {
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          ky.request.headers.set(
            'accept',
            ky.request.headers.get('accept') || mimeType
          )
          const response = await result
          if (type === 'json') {
            if (response.status === 204) {
              return ''
            }
            const text = await response.text()
            if (text === '') {
              return ''
            }
            if (options.parseJson) {
              return options.parseJson(text)
            }
            return JSON.parse(text)
          }
          return response[type]()
        }
      }
      return result
    }
    // eslint-disable-next-line unicorn/prevent-abbreviations
    static #normalizeSearchParams (searchParams) {
      // Filter out undefined values from plain objects
      if (
        searchParams &&
        typeof searchParams === 'object' &&
        !Array.isArray(searchParams) &&
        !(searchParams instanceof URLSearchParams)
      ) {
        return Object.fromEntries(
          Object.entries(searchParams).filter(
            ([, value]) => value !== undefined
          )
        )
      }
      return searchParams
    }
    request
    #abortController
    #retryCount = 0
    // eslint-disable-next-line @typescript-eslint/prefer-readonly -- False positive: #input is reassigned on line 202
    #input
    #options
    #originalRequest
    #userProvidedAbortSignal
    #cachedNormalizedOptions
    // eslint-disable-next-line complexity
    constructor (input, options = {}) {
      this.#input = input
      this.#options = {
        ...options,
        headers: mergeHeaders(this.#input.headers, options.headers),
        hooks: mergeHooks(
          {
            beforeRequest: [],
            beforeRetry: [],
            beforeError: [],
            afterResponse: []
          },
          options.hooks
        ),
        method: normalizeRequestMethod(
          options.method ?? this.#input.method ?? 'GET'
        ),
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        prefixUrl: String(options.prefixUrl || ''),
        retry: normalizeRetryOptions(options.retry),
        throwHttpErrors: options.throwHttpErrors ?? true,
        timeout: options.timeout ?? 10_000,
        fetch: options.fetch ?? globalThis.fetch.bind(globalThis),
        context: options.context ?? {}
      }
      if (
        typeof this.#input !== 'string' &&
        !(
          this.#input instanceof URL ||
          this.#input instanceof globalThis.Request
        )
      ) {
        throw new TypeError('`input` must be a string, URL, or Request')
      }
      if (this.#options.prefixUrl && typeof this.#input === 'string') {
        if (this.#input.startsWith('/')) {
          throw new Error(
            '`input` must not begin with a slash when using `prefixUrl`'
          )
        }
        if (!this.#options.prefixUrl.endsWith('/')) {
          this.#options.prefixUrl += '/'
        }
        this.#input = this.#options.prefixUrl + this.#input
      }
      if (supportsAbortController && supportsAbortSignal) {
        this.#userProvidedAbortSignal =
          this.#options.signal ?? this.#input.signal
        this.#abortController = new globalThis.AbortController()
        this.#options.signal = this.#userProvidedAbortSignal
          ? AbortSignal.any([
              this.#userProvidedAbortSignal,
              this.#abortController.signal
            ])
          : this.#abortController.signal
      }
      if (supportsRequestStreams) {
        // @ts-expect-error - Types are outdated.
        this.#options.duplex = 'half'
      }
      if (this.#options.json !== undefined) {
        this.#options.body =
          this.#options.stringifyJson?.(this.#options.json) ??
          JSON.stringify(this.#options.json)
        this.#options.headers.set(
          'content-type',
          this.#options.headers.get('content-type') ?? 'application/json'
        )
      }
      // To provide correct form boundary, Content-Type header should be deleted when creating Request from another Request with FormData/URLSearchParams body
      // Only delete if user didn't explicitly provide a custom content-type
      const userProvidedContentType =
        options.headers &&
        new globalThis.Headers(options.headers).has('content-type')
      if (
        this.#input instanceof globalThis.Request &&
        ((supportsFormData &&
          this.#options.body instanceof globalThis.FormData) ||
          this.#options.body instanceof URLSearchParams) &&
        !userProvidedContentType
      ) {
        this.#options.headers.delete('content-type')
      }
      this.request = new globalThis.Request(this.#input, this.#options)
      if (hasSearchParameters(this.#options.searchParams)) {
        // eslint-disable-next-line unicorn/prevent-abbreviations
        const textSearchParams =
          typeof this.#options.searchParams === 'string'
            ? this.#options.searchParams.replace(/^\?/, '')
            : new URLSearchParams(
                Ky.#normalizeSearchParams(this.#options.searchParams)
              ).toString()
        // eslint-disable-next-line unicorn/prevent-abbreviations
        const searchParams = '?' + textSearchParams
        const url = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, searchParams)
        // Recreate request with the updated URL. We already have all options in this.#options, including duplex.
        this.request = new globalThis.Request(url, this.#options)
      }
      // If `onUploadProgress` is passed, it uses the stream API internally
      if (this.#options.onUploadProgress) {
        if (typeof this.#options.onUploadProgress !== 'function') {
          throw new TypeError(
            'The `onUploadProgress` option must be a function'
          )
        }
        if (!supportsRequestStreams) {
          throw new Error(
            'Request streams are not supported in your environment. The `duplex` option for `Request` is not available.'
          )
        }
        this.request = this.#wrapRequestWithUploadProgress(
          this.request,
          this.#options.body ?? undefined
        )
      }
    }
    #calculateDelay () {
      const retryDelay = this.#options.retry.delay(this.#retryCount)
      let jitteredDelay = retryDelay
      if (this.#options.retry.jitter === true) {
        jitteredDelay = Math.random() * retryDelay
      } else if (typeof this.#options.retry.jitter === 'function') {
        jitteredDelay = this.#options.retry.jitter(retryDelay)
        if (!Number.isFinite(jitteredDelay) || jitteredDelay < 0) {
          jitteredDelay = retryDelay
        }
      }
      // Handle undefined backoffLimit by treating it as no limit (Infinity)
      const backoffLimit =
        this.#options.retry.backoffLimit ?? Number.POSITIVE_INFINITY
      return Math.min(backoffLimit, jitteredDelay)
    }
    async #calculateRetryDelay (error) {
      this.#retryCount++
      if (this.#retryCount > this.#options.retry.limit) {
        throw error
      }
      // Wrap non-Error throws to ensure consistent error handling
      const errorObject = error instanceof Error ? error : new NonError(error)
      // Handle forced retry from afterResponse hook - skip method check and shouldRetry
      if (errorObject instanceof ForceRetryError) {
        return errorObject.customDelay ?? this.#calculateDelay()
      }
      // Check if method is retriable for non-forced retries
      if (
        !this.#options.retry.methods.includes(this.request.method.toLowerCase())
      ) {
        throw error
      }
      // User-provided shouldRetry function takes precedence over all other checks
      if (this.#options.retry.shouldRetry !== undefined) {
        const result = await this.#options.retry.shouldRetry({
          error: errorObject,
          retryCount: this.#retryCount
        })
        // Strict boolean checking - only exact true/false are handled specially
        if (result === false) {
          throw error
        }
        if (result === true) {
          // Force retry - skip all other validation and return delay
          return this.#calculateDelay()
        }
        // If undefined or any other value, fall through to default behavior
      }
      // Default timeout behavior
      if (isTimeoutError(error) && !this.#options.retry.retryOnTimeout) {
        throw error
      }
      if (isHTTPError(error)) {
        if (!this.#options.retry.statusCodes.includes(error.response.status)) {
          throw error
        }
        const retryAfter =
          error.response.headers.get('Retry-After') ??
          error.response.headers.get('RateLimit-Reset') ??
          error.response.headers.get('X-RateLimit-Retry-After') ?? // Symfony-based services
          error.response.headers.get('X-RateLimit-Reset') ?? // GitHub
          error.response.headers.get('X-Rate-Limit-Reset') // Twitter
        if (
          retryAfter &&
          this.#options.retry.afterStatusCodes.includes(error.response.status)
        ) {
          let after = Number(retryAfter) * 1000
          if (Number.isNaN(after)) {
            after = Date.parse(retryAfter) - Date.now()
          } else if (after >= Date.parse('2024-01-01')) {
            // A large number is treated as a timestamp (fixed threshold protects against clock skew)
            after -= Date.now()
          }
          const max = this.#options.retry.maxRetryAfter ?? after
          // Don't apply jitter when server provides explicit retry timing
          return after < max ? after : max
        }
        if (error.response.status === 413) {
          throw error
        }
      }
      return this.#calculateDelay()
    }
    #decorateResponse (response) {
      if (this.#options.parseJson) {
        response.json = async () =>
          this.#options.parseJson(await response.text())
      }
      return response
    }
    #cancelBody (body) {
      if (!body) {
        return
      }
      // Ignore cancellation failures from already-locked or already-consumed streams.
      void body.cancel().catch(() => undefined)
    }
    #cancelResponseBody (response) {
      // Ignore cancellation failures from already-locked or already-consumed streams.
      this.#cancelBody(response.body ?? undefined)
    }
    async #retry (function_) {
      try {
        return await function_()
      } catch (error) {
        const ms = Math.min(
          await this.#calculateRetryDelay(error),
          maxSafeTimeout
        )
        if (this.#retryCount < 1) {
          throw error
        }
        // Only use user-provided signal for delay, not our internal abortController
        await delay(
          ms,
          this.#userProvidedAbortSignal
            ? { signal: this.#userProvidedAbortSignal }
            : {}
        )
        // Apply custom request from forced retry before beforeRetry hooks
        // Ensure the custom request has the correct managed signal for timeouts and user aborts
        if (error instanceof ForceRetryError && error.customRequest) {
          const managedRequest = this.#options.signal
            ? new globalThis.Request(error.customRequest, {
                signal: this.#options.signal
              })
            : new globalThis.Request(error.customRequest)
          this.#assignRequest(managedRequest)
        }
        for (const hook of this.#options.hooks.beforeRetry) {
          // eslint-disable-next-line no-await-in-loop
          const hookResult = await hook({
            request: this.request,
            options: this.#getNormalizedOptions(),
            error: error,
            retryCount: this.#retryCount
          })
          if (hookResult instanceof globalThis.Request) {
            this.#assignRequest(hookResult)
            break
          }
          // If a Response is returned, use it and skip the retry
          if (hookResult instanceof globalThis.Response) {
            return hookResult
          }
          // If `stop` is returned from the hook, the retry process is stopped
          if (hookResult === stop) {
            return
          }
        }
        return this.#retry(function_)
      }
    }
    async #fetch () {
      // Reset abortController if it was aborted (happens on timeout retry)
      if (this.#abortController?.signal.aborted) {
        this.#abortController = new globalThis.AbortController()
        this.#options.signal = this.#userProvidedAbortSignal
          ? AbortSignal.any([
              this.#userProvidedAbortSignal,
              this.#abortController.signal
            ])
          : this.#abortController.signal
        // Recreate request with new signal
        this.request = new globalThis.Request(this.request, {
          signal: this.#options.signal
        })
      }
      for (const hook of this.#options.hooks.beforeRequest) {
        // eslint-disable-next-line no-await-in-loop
        const result = await hook(this.request, this.#getNormalizedOptions(), {
          retryCount: this.#retryCount
        })
        if (result instanceof Response) {
          return result
        }
        if (result instanceof globalThis.Request) {
          this.#assignRequest(result)
          break
        }
      }
      const nonRequestOptions = findUnknownOptions(this.request, this.#options)
      // Cloning is done here to prepare in advance for retries
      this.#originalRequest = this.request
      this.request = this.#originalRequest.clone()
      if (this.#options.timeout === false) {
        return this.#options.fetch(this.#originalRequest, nonRequestOptions)
      }
      return timeout(
        this.#originalRequest,
        nonRequestOptions,
        this.#abortController,
        this.#options
      )
    }
    #getNormalizedOptions () {
      if (!this.#cachedNormalizedOptions) {
        const { hooks, ...normalizedOptions } = this.#options
        this.#cachedNormalizedOptions = Object.freeze(normalizedOptions)
      }
      return this.#cachedNormalizedOptions
    }
    #assignRequest (request) {
      this.#cachedNormalizedOptions = undefined
      this.request = this.#wrapRequestWithUploadProgress(request)
    }
    #wrapRequestWithUploadProgress (request, originalBody) {
      if (!this.#options.onUploadProgress || !request.body) {
        return request
      }
      return streamRequest(
        request,
        this.#options.onUploadProgress,
        originalBody ?? this.#options.body ?? undefined
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
    ky.extend = newDefaults => {
      if (typeof newDefaults === 'function') {
        newDefaults = newDefaults(defaults ?? {})
      }
      return createInstance(validateAndMerge(defaults, newDefaults))
    }
    ky.stop = stop
    ky.retry = retry
    return ky
  }
  const ky$1 = createInstance()
  // Intentionally not exporting this for now as it's just an implementation detail and we don't want to commit to a certain API yet at least.
  // export {NonError} from './errors/NonError.js';

  var distribution = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ForceRetryError: ForceRetryError,
    HTTPError: HTTPError,
    TimeoutError: TimeoutError,
    default: ky$1,
    isForceRetryError: isForceRetryError,
    isHTTPError: isHTTPError,
    isKyError: isKyError,
    isTimeoutError: isTimeoutError
  })

  var require$$1 = /*@__PURE__*/ getAugmentedNamespace(distribution)

  const VERSION$1 = '0.14.1'

  var constants = {
    VERSION: VERSION$1,
    USER_AGENT: `mql/${VERSION$1}`,
    /**
     * Based on require('got').defaults.options.retry.statusCodes
     * but without 429 (too many requests)
     */
    RETRY_STATUS_CODES: [408, 413, 500, 502, 503, 504, 521, 522, 524]
  }

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

  const isURL = url => {
    try {
      return /^https?:\/\//i.test(new URL(url).href)
    } catch (_) {
      return false
    }
  }

  const factory$1 = streamResponseType => ({
    VERSION,
    MicrolinkError,
    got,
    flatten
  }) => {
    const assertUrl = (url = '') => {
      if (!isURL(url)) {
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
      { data, apiKey, endpoint, ...opts } = {},
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
      return [apiUrl, { ...gotOpts, responseType, headers }]
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

  const { flattie: flatten } = dist
  const { default: ky } = require$$1

  const { VERSION, USER_AGENT, RETRY_STATUS_CODES } = constants

  const kyInstance = ky.extend({
    headers: { 'user-agent': USER_AGENT },
    retry: { statusCodes: RETRY_STATUS_CODES }
  })

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
      const response = await kyInstance(url, opts)
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

  got.stream = (...args) => kyInstance(...args).then(res => res.body)

  const mql = factory({
    MicrolinkError,
    got,
    flatten,
    VERSION
  })

  lightweight.exports = mql
  var arrayBuffer = (lightweight.exports.arrayBuffer = mql.extend({
    responseType: 'arrayBuffer'
  }))
  var extend = (lightweight.exports.extend = mql.extend)
  var fetchFromApi = (lightweight.exports.fetchFromApi = mql.fetchFromApi)
  var getApiUrl = (lightweight.exports.getApiUrl = mql.getApiUrl)
  var mapRules = (lightweight.exports.mapRules = mql.mapRules)
  var MicrolinkError_1 = (lightweight.exports.MicrolinkError =
    mql.MicrolinkError)
  var version = (lightweight.exports.version = mql.version)

  var lightweightExports = lightweight.exports
  var lightweight_default = /*@__PURE__*/ getDefaultExportFromCjs(
    lightweightExports
  )

  exports.MicrolinkError = MicrolinkError_1
  exports.arrayBuffer = arrayBuffer
  exports.default = lightweight_default
  exports.extend = extend
  exports.fetchFromApi = fetchFromApi
  exports.getApiUrl = getApiUrl
  exports.mapRules = mapRules
  exports.version = version

  Object.defineProperty(exports, '__esModule', { value: true })
})
