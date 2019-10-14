'use strict'

const { default: ky } = require('ky-universal')
const { encode: stringify } = require('qss')
const isUrlHttp = require('is-url-http')
const flatten = require('flat')
const whoops = require('whoops')

const factory = require('./factory')
const MicrolinkError = whoops('MicrolinkError')

// TODO: `cache` is destructuring because is not supported on browser side yet.
// TODO: `json` because always is the output serialized.
const got = async (url, { json, cache, ...opts }) => {
  try {
    const response = await ky(url, opts)
    const body = await response.json()
    const { headers, status: statusCode, statusText: statusMessage } = response
    return { url: response.url, body, headers, statusCode, statusMessage }
  } catch (err) {
    if (err.response) {
      err.body = await err.response.json()
      err.statusCode = err.response.status
      err.headers = err.response.headers
    }
    throw err
  }
}

module.exports = factory({
  MicrolinkError,
  isUrlHttp,
  stringify,
  got,
  flatten,
  VERSION: '__VERSION__'
})
