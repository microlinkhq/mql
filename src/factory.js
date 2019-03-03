const ENDPOINT = {
  FREE: 'https://api.microlink.io',
  PRO: 'https://pro.microlink.io'
}

const ERRORS_CODE = {
  INVALID_URL: 'ENOVALIDURL',
  FAILED: 'EFAILED'
}

function factory ({ MicrolinkError, isUrlHttp, stringify, got }) {
  const assertUrl = url => {
    if (!isUrlHttp(url)) {
      throw new MicrolinkError({
        code: ERRORS_CODE.INVALID_URL,
        message: `The \`url\` value ${
          url ? `'${url}' ` : ''
        }is not a valid HTTP URL.`.trim()
      })
    }
  }

  const fetchFromApi = async (url, opts) => {
    try {
      const response = await got(url, opts)
      const { body } = response
      return { ...body, response }
    } catch (err) {
      const message = err.body ? err.body.message : err.message
      const status = err.body ? err.body.status : 'fail'
      throw MicrolinkError({
        ...err,
        status,
        message,
        code: ERRORS_CODE.FAILED
      })
    }
  }

  const apiUrl = (url, { apiKey, ...opts } = {}) => {
    const isPro = !!apiKey
    const endpoint = ENDPOINT[isPro ? 'PRO' : 'FREE']
    const apiUrl = `${endpoint}?${stringify({ url: url, ...opts })}`
    const headers = isPro ? { 'x-api-key': apiKey } : {}
    return [apiUrl, { headers }]
  }

  const mql = async (
    targetUrl,
    { cache = null, retry = 3, timeout = 25000, ...opts } = {}
  ) => {
    assertUrl(targetUrl)
    const [url, { headers }] = apiUrl(targetUrl, opts)
    return fetchFromApi(url, { cache, retry, timeout, headers, json: true })
  }

  mql.MicrolinkError = MicrolinkError
  mql.apiUrl = apiUrl

  return mql
}

module.exports = factory
module.exports.default = factory
