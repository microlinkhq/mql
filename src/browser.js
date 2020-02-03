'use strict'

const { encode: stringify } = require('qss')
const isUrlHttp = require('is-url-http')
const ky = require('ky-universal')
const whoops = require('whoops')
const flatten = require('flat')

const factory = require('./factory')
const MicrolinkError = whoops('MicrolinkError')

const got = async (url, { responseType, ...opts }) => {
  try {
    const response = await ky(url, opts)
    const body = await response.json()
    const { headers, status: statusCode, statusText: statusMessage } = response
    return { url: response.url, body, headers, statusCode, statusMessage }
  } catch (err) {
    if (err.response) {
      const { response } = err
      err.response = { ...response, statusCode: response.status, body: await response.json() }
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
