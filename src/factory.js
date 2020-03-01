const ENDPOINT = {
  FREE: 'https://api.microlink.io',
  PRO: 'https://pro.microlink.io'
}

const pickBy = obj => {
  Object.keys(obj).forEach(key => obj[key] == null && delete obj[key])
  return obj
}

const isTimeoutError = (err, statusCode) =>
  // client side error
  err.name === 'TimeoutError' ||
  // server side error
  (err.name === 'HTTPError' && statusCode.toString()[0] === '5') ||
  // browser side unexpected error
  err.type === 'invalid-json'

const factory = ({ VERSION, MicrolinkError, isUrlHttp, stringify, got, flatten }) => {
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

  const fetchFromApi = async (apiUrl, opts = {}) => {
    try {
      const response = await got(apiUrl, opts)
      const { body } = response
      return { ...body, response }
    } catch (err) {
      const { name, message: rawMessage, response = {} } = err
      const { statusCode = 500, body: rawBody, headers, url: uri = apiUrl } = response
      const retryTime = Number((opts.retry * opts.timeout).toFixed(0))
      const isClientError = name === 'TimeoutError'

      if (isTimeoutError(err, statusCode)) {
        const message = `The request reached timeout after ${retryTime}ms.`
        throw new MicrolinkError({
          url: uri,
          data: { url: message },
          status: 'fail',
          code: isClientError ? 'ETIMEOUTCLIENT' : 'ETIMEOUT',
          message,
          more: `https://microlink.io/${isClientError ? 'etimeoutclient' : 'etimeout'}`,
          statusCode,
          headers
        })
      }

      const body = rawBody
        ? typeof rawBody === 'string' || Buffer.isBuffer(rawBody)
          ? JSON.parse(rawBody)
          : rawBody
        : { message: rawMessage, status: 'fail' }

      throw MicrolinkError({
        ...body,
        message: body.message,
        url: uri,
        statusCode,
        headers
      })
    }
  }

  const getApiUrl = (
    url,
    {
      data,
      apiKey,
      endpoint,
      isStream = false,
      retry = 3,
      timeout = 30000,
      responseType = 'json',
      ...opts
    } = {}
  ) => {
    const isPro = !!apiKey
    const apiEndpoint = endpoint || ENDPOINT[isPro ? 'PRO' : 'FREE']

    const apiUrl = `${apiEndpoint}?${stringify({
      url,
      ...mapRules(data),
      ...flatten(pickBy(opts))
    })}`

    const headers = isPro ? { 'x-api-key': apiKey } : {}
    return [apiUrl, { retry, timeout, responseType, isStream, headers }]
  }

  const mql = async (url, opts = {}) => {
    assertUrl(url)
    const [apiUrl, fetchOpts] = getApiUrl(url, opts)
    return fetchFromApi(apiUrl, { ...opts, ...fetchOpts })
  }

  mql.MicrolinkError = MicrolinkError
  mql.getApiUrl = getApiUrl
  mql.fetchFromApi = fetchFromApi
  mql.mapRules = mapRules
  mql.version = VERSION
  mql.stream = (url, opts) => got.stream(url, { retry: 3, timeout: 30000, ...opts })

  return mql
}

module.exports = factory
