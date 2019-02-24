import { stringify } from 'querystring'
import isUrlHttp from 'is-url-http'
import ky from 'ky-universal'
import whoops from 'whoops'

import factory from './factory'

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

export default factory({
  whoops,
  isUrlHttp,
  stringify,
  got
})
