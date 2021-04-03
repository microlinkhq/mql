'use strict'

const isUrlHttp = require('is-url-http/lightweight')
const { flattie: flatten } = require('flattie')
const { encode: stringify } = require('qss')
const whoops = require('whoops')

const factory = require('./factory')
const ky = require('./ky')

const MicrolinkError = whoops('MicrolinkError')

const got = async (url, opts) => {
  try {
    if (opts.timeout === undefined) opts.timeout = false
    const response = await ky(url, opts)
    const body = await response.json()
    const { headers, status: statusCode, statusText: statusMessage } = response
    return { url: response.url, body, headers, statusCode, statusMessage }
  } catch (err) {
    if (err.response) {
      const { response } = err
      err.response = {
        ...response,
        headers: [...response.headers.entries()].reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value }),
          {}
        ),
        statusCode: response.status,
        body: await response.text()
      }
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
  VERSION: '__MQL_VERSION__'
})
