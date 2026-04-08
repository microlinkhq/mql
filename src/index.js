'use strict'

const { flattie: flatten } = require('flattie')
const { default: ky } = require('ky')

const {
  VERSION,
  USER_AGENT,
  RETRY_STATUS_CODES,
  RETRY_AFTER_STATUS_CODES
} = require('./constants')

const ENDPOINT = {
  FREE: 'https://api.microlink.io/',
  PRO: 'https://pro.microlink.io/'
}

const STREAM_RESPONSE_TYPE = 'arrayBuffer'

const kyInstance = ky.extend({
  headers: { 'user-agent': USER_AGENT },
  retry: {
    statusCodes: RETRY_STATUS_CODES,
    afterStatusCodes: RETRY_AFTER_STATUS_CODES
  }
})

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

const headersToObject = headers =>
  headers != null && typeof headers.entries === 'function'
    ? Array.from(headers.entries()).reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {})
    : headers

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

const doFetch = async (apiUrl, { responseType, ...opts }) => {
  if (opts.timeout === undefined) opts.timeout = false
  const response = await kyInstance(apiUrl, opts)
  const body = await response[responseType]()
  const { headers, status: statusCode } = response
  return { url: response.url, body, headers, statusCode }
}

const fetchFromApi = async (apiUrl, opts = {}) => {
  try {
    const response = await doFetch(apiUrl, opts)
    return opts.responseType === STREAM_RESPONSE_TYPE
      ? response
      : { ...response.body, response }
  } catch (error) {
    const { response = {} } = error
    const { statusCode: responseStatusCode, status } = response
    const {
      body: rawBody,
      headers: responseHeaders = {},
      url: uri = apiUrl
    } = response

    const statusCode = responseStatusCode ?? status
    const headers = headersToObject(responseHeaders)

    let bodyInput = rawBody
    const isBodyReadableStream =
      bodyInput != null && typeof bodyInput.getReader === 'function'

    if (
      (bodyInput === undefined || isBodyReadableStream) &&
      typeof response.text === 'function'
    ) {
      try {
        bodyInput = await response.text()
      } catch (_) {
        bodyInput = undefined
      }
    }

    const isBodyBuffer = isBuffer(bodyInput)
    const body =
      isObject(bodyInput) && !isBodyBuffer
        ? bodyInput
        : parseBody(isBodyBuffer ? bodyInput.toString() : bodyInput, error, uri)

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

  if (opts.stream) responseType = STREAM_RESPONSE_TYPE

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
mql.stream = (...args) => kyInstance(...args).then(res => res.body)

module.exports = mql
module.exports.arrayBuffer = mql.extend({ responseType: STREAM_RESPONSE_TYPE })
module.exports.buffer = module.exports.arrayBuffer
module.exports.extend = mql.extend
module.exports.fetchFromApi = mql.fetchFromApi
module.exports.getApiUrl = mql.getApiUrl
module.exports.mapRules = mql.mapRules
module.exports.MicrolinkError = mql.MicrolinkError
module.exports.version = mql.version
