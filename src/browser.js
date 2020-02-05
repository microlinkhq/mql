'use strict'

const ky = require('ky-universal').default || require('ky-universal')
const { encode: stringify } = require('qss')
const whoops = require('whoops')
const flatten = require('flat')
const { URL } = require('url')

const factory = require('./factory')

const REGEX_HTTP_PROTOCOL = /^https?:\/\//i

const MicrolinkError = whoops('MicrolinkError')

// lightweight version of `is-url-http`
const isUrlHttp = url => {
  try {
    return REGEX_HTTP_PROTOCOL.test(new URL(url).href)
  } catch (err) {
    return false
  }
}

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
