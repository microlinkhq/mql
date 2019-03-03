import { stringify } from 'qs'
import isUrlHttp from 'is-url-http'
import ky from 'ky-universal'

const factory = require('./factory')

const MicrolinkError = require('whoops')('MicrolinkError')

// TODO: `cache` is destructuring because is not supported on browser side yet.
// TODO: `json` because always is the output serialized.
const got = async (url, { json, headers, cache, ...opts }) => {
  try {
    const response = await ky(url, opts)
    const body = await response.json()
    const { headers, status: statusCode, statusText: statusMessage } = response
    return { url: response.url, body, headers, statusCode, statusMessage }
  } catch (err) {
    err.body = err.response ? await err.response.json() : ''
    err.statusCode = err.response.status
    err.headers = err.response.headers
    throw err
  }
}

export default factory({
  MicrolinkError,
  isUrlHttp,
  stringify,
  got
})
