'use strict'

const { flattie: flatten } = require('flattie')
const { default: ky } = require('ky')

const {
  VERSION,
  USER_AGENT,
  RETRY_STATUS_CODES,
  RETRY_AFTER_STATUS_CODES
} = require('./constants')

const kyInstance = ky.extend({
  headers: { 'user-agent': USER_AGENT },
  retry: {
    statusCodes: RETRY_STATUS_CODES,
    afterStatusCodes: RETRY_AFTER_STATUS_CODES
  }
})

const factory = require('./factory')('arrayBuffer')

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
  if (opts.timeout === undefined) opts.timeout = false
  const response = await kyInstance(url, opts)
  const body = await response[responseType]()
  const { headers, status: statusCode } = response
  return { url: response.url, body, headers, statusCode }
}

got.stream = (...args) => kyInstance(...args).then(res => res.body)

const mql = factory({
  MicrolinkError,
  got,
  flatten,
  VERSION
})

module.exports = mql
module.exports.arrayBuffer = mql.extend({ responseType: 'arrayBuffer' })
module.exports.buffer = module.exports.arrayBuffer
module.exports.extend = mql.extend
module.exports.fetchFromApi = mql.fetchFromApi
module.exports.getApiUrl = mql.getApiUrl
module.exports.mapRules = mql.mapRules
module.exports.MicrolinkError = mql.MicrolinkError
module.exports.version = mql.version
