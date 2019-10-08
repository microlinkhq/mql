const ENDPOINT = {
  FREE: 'https://api.microlink.io',
  PRO: 'https://pro.microlink.io'
}

const isTimeoutError = err =>
  // client side error
  err.name === 'TimeoutError' ||
  // server side error
  (err.name === 'HTTPError' && err.statusCode.toString()[0] === '5') ||
  // browser side unexpected error
  err.type === 'invalid-json'

function factory ({
  VERSION,
  MicrolinkError,
  isUrlHttp,
  stringify,
  got,
  flatten
}) {
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

  const mapRules = (rules = {}) => {
    const flatRules = flatten(rules)
    return Object.keys(flatRules).reduce(
      (acc, key) => ({ ...acc, [`data.${key}`]: flatRules[key] }),
      {}
    )
  }

  const fetchFromApi = async (url, apiUrl, opts) => {
    try {
      const response = await got(apiUrl, opts)
      const { body } = response
      return { ...body, response }
    } catch (err) {
      const { name, statusCode = 500, body: rawBody, message: rawMessage } = err

      if (isTimeoutError(err)) {
        const message = `The \`url\` as \`${url}\` reached timeout after ${
          opts.retry.maxRetryAfter
        }ms.`
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
      const message = body.data
        ? body.data[Object.keys(body.data)[0]]
        : body.message

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
      url: url,
      ...mapRules(data),
      ...opts
    })}`

    const headers = isPro ? { 'x-api-key': apiKey } : {}
    return [apiUrl, { headers }]
  }

  const mql = async (
    url,
    {
      encoding = 'utf8',
      cache = false,
      retry = 2,
      timeout = 30000,
      json = true,
      ...opts
    } = {}
  ) => {
    assertUrl(url)
    const [apiUrl, { headers }] = getApiUrl(url, opts)

    return fetchFromApi(url, apiUrl, {
      encoding,
      cache,
      retry,
      timeout,
      headers,
      json
    })
  }

  mql.MicrolinkError = MicrolinkError
  mql.getApiUrl = getApiUrl
  mql.mapRules = mapRules
  mql.version = VERSION
  mql.stream = got.stream

  return mql
}

module.exports = factory
