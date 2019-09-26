const MicrolinkError = require('whoops')('MicrolinkError')
const { encode: stringify } = require('qss')
const isUrlHttp = require('is-url-http')
const { default: ky } = require('ky-universal')
const flatten = require('flat')

const factory = require('./factory')

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

const browser = factory({
  MicrolinkError,
  isUrlHttp,
  stringify,
  got,
  flatten,
  VERSION: '__VERSION__'
})

module.exports = browser
