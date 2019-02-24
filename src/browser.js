'use strict'

const ky = require('ky-universal')

const got = async (url, { json, ...opts }) => {
  try {
    const response = await ky(url, opts)
    const body = await response.json()
    const { headers, status: statusCode, statusText: statusMessage } = response
    return { url: response.url, body, headers, statusCode, statusMessage }
  } catch (err) {
    err.body = await err.response.json()
    err.statusCode = err.response.status
    err.headers = err.response.headers
    throw err
  }
}

module.exports = require('./factory')({
  whoops: require('whoops'),
  isUrlHttp: require('is-url-http'),
  stringify: require('querystring').stringify,
  got
})
