'use strict'

const ENDPOINT = {
  FREE: 'https://api.microlink.io',
  PRO: 'https://pro.microlink.io'
}

module.exports = ({ whoops, isUrlHttp, stringify, got }) => {
  const MicrolinkError = whoops('MicrolinkError')

  const assertUrl = url => {
    if (!isUrlHttp(url)) {
      throw new MicrolinkError({
        code: 'ENOVALIDURL',
        message: `The \`url\` value ${
          url ? `'${url}' ` : ''
        }is not a valid HTTP URL.`.trim()
      })
    }
  }

  const apiUrl = (url, { key, ...opts } = {}) => {
    const isPro = !!key
    const endpoint = ENDPOINT[isPro ? 'PRO' : 'FREE']
    const apiUrl = `${endpoint}?${stringify({ url: url, ...opts })}`
    const headers = isPro ? { 'x-api-key': key } : {}
    return [apiUrl, { headers }]
  }

  // TODO: Add `agent` support
  // TODO: Add `batch` support https://www.npmjs.com/package/dataloader
  const MQL = async (
    targetUrl,
    { cache = null, retry = 3, timeout = 25000, ...opts } = {}
  ) => {
    assertUrl(targetUrl)
    const [url, { headers }] = apiUrl(targetUrl, opts)
    const response = await got(url, {
      cache,
      retry,
      timeout,
      headers,
      json: true
    })
    const { body } = response
    return { ...body, response }
  }

  MQL.MicrolinkError = MicrolinkError
  MQL.apiUrl = apiUrl

  return MQL
}
