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
  typeof input?.constructor?.isBuffer === 'function' &&
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
    const { protocol } = new URL(url)
    return protocol === 'http:' || protocol === 'https:'
  } catch (_) {
    return false
  }
}

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
  return Object.fromEntries(
    Object.entries(flatten(rules)).map(([key, value]) => [
      `data.${key}`,
      value.toString()
    ])
  )
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
      headers: responseHeaders,
      url: uri = apiUrl
    } = response

    const statusCode = responseStatusCode ?? status
    const headers =
      typeof responseHeaders?.entries === 'function'
        ? Object.fromEntries(responseHeaders.entries())
        : responseHeaders || {}

    let bodyInput = error.data ?? rawBody
    const isBodyReadableStream = typeof bodyInput?.getReader === 'function'

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
      url: uri,
      statusCode,
      headers
    })
  }
}

const getApiUrl = (
  url,
  { data, apiKey, endpoint, ...opts } = {},
  { responseType = 'json', headers: responseHeaders = {}, ...gotOpts } = {}
) => {
  const isPro = !!apiKey
  const apiEndpoint = endpoint || ENDPOINT[isPro ? 'PRO' : 'FREE']

  const apiUrl = `${apiEndpoint}?${new URLSearchParams({
    url,
    ...mapRules(data),
    ...flatten(opts)
  })}`

  const headers = isPro
    ? { ...responseHeaders, 'x-api-key': apiKey }
    : responseHeaders

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
