const ENDPOINT = {
  FREE: 'https://api.microlink.io',
  PRO: 'https://pro.microlink.io'
}

const isTimeoutError = (err, statusCode) =>
  // client side error
  err.name === 'TimeoutError' ||
  // server side error
  (err.name === 'HTTPError' && statusCode.toString()[0] === '5') ||
  // browser side unexpected error
  err.type === 'invalid-json'

function factory ({ VERSION, MicrolinkError, isUrlHttp, stringify, got, flatten }) {
  const assertUrl = (url = '') => {
    if (!isUrlHttp(url)) {
      const message = `The \`url\` as \`${url}\` is not valid. Ensure it has protocol (http or https) and hostname.`
      throw new MicrolinkError({
        url,
        data: { url: message },
        status: 'fail',
        code: 'EINVALURLCLIENT',
        message,
        more: 'https://microlink.io/docs/api/api-parameters/url'
      })
    }
  }

  const mapRules = rules => {
    if (typeof rules !== 'object') return
    const flatRules = flatten(rules)
    return Object.keys(flatRules).reduce(
      (acc, key) => ({ ...acc, [`data.${key}`]: flatRules[key] }),
      {}
    )
  }

  const fetchFromApiOpts = {
    retry: 3,
    timeout: 30000,
    responseType: 'json'
  }

  const fetchFromApi = async (url, apiUrl, opts = {}) => {
    opts = { ...fetchFromApiOpts, ...opts }
    try {
      const response = await got(apiUrl, opts)
      const { body } = response
      return { ...body, response }
    } catch (err) {
      const { name, message: rawMessage, response = {} } = err
      const { statusCode = 500, body: rawBody } = response

      if (isTimeoutError(err, statusCode)) {
        const message = `The \`url\` as \`${url}\` reached timeout after ${opts.retry.maxRetryAfter}ms.`
        throw new MicrolinkError({
          url,
          data: { url: message },
          status: 'fail',
          code: name === 'TimeoutError' ? 'ETIMEOUTCLIENT' : 'ETIMEOUT',
          message,
          more: 'https://microlink.io/docs/api/api-parameters/url',
          statusCode
        })
      }

      const body = rawBody
        ? typeof rawBody === 'string' || Buffer.isBuffer(rawBody)
          ? JSON.parse(rawBody)
          : rawBody
        : { message: rawMessage, status: 'fail' }

      const message = body.data ? body.data[Object.keys(body.data)[0]] : body.message

      throw MicrolinkError({
        ...body,
        message,
        url,
        statusCode
      })
    }
  }

  const getApiUrl = (url, { data, apiKey, endpoint, ...opts } = {}) => {
    const isPro = !!apiKey
    const apiEndpoint = endpoint || ENDPOINT[isPro ? 'PRO' : 'FREE']

    const apiUrl = `${apiEndpoint}?${stringify({
      url,
      ...mapRules(data),
      ...flatten(opts)
    })}`

    const headers = isPro ? { 'x-api-key': apiKey } : {}
    return [apiUrl, { headers }]
  }

  const mql = async (url, opts = {}) => {
    assertUrl(url)
    const [apiUrl, fetchOpts] = getApiUrl(url, opts)
    return fetchFromApi(url, apiUrl, { ...opts, ...fetchOpts })
  }

  mql.MicrolinkError = MicrolinkError
  mql.getApiUrl = getApiUrl
  mql.fetchFromApi = fetchFromApi
  mql.mapRules = mapRules
  mql.version = VERSION
  mql.stream = got.stream

  return mql
}

module.exports = factory
