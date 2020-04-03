const ENDPOINT = {
  FREE: 'https://api.microlink.io',
  PRO: 'https://pro.microlink.io'
}

const pickBy = obj => {
  Object.keys(obj).forEach(key => obj[key] == null && delete obj[key])
  return obj
}

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
      const { message: rawMessage, response = {} } = err
      const { statusCode, body: rawBody, headers, url: uri = apiUrl } = response

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
    { data, apiKey, endpoint, retry, cache, ...opts } = {},
    { responseType = 'json', ...gotOpts } = {}
  ) => {
    const isPro = !!apiKey
    const apiEndpoint = endpoint || ENDPOINT[isPro ? 'PRO' : 'FREE']

    const apiUrl = `${apiEndpoint}?${stringify({
      url,
      ...mapRules(data),
      ...flatten(pickBy(opts))
    })}`

    const headers = isPro ? { 'x-api-key': apiKey } : {}
    return [apiUrl, { ...gotOpts, responseType, cache, retry, headers, timeout: false }]
  }

  const createMql = gotOpts => async (url, opts = {}) => {
    assertUrl(url)
    const [apiUrl, fetchOpts] = getApiUrl(url, opts, gotOpts)
    return fetchFromApi(apiUrl, fetchOpts)
  }

  const mql = createMql()
  mql.MicrolinkError = MicrolinkError
  mql.getApiUrl = getApiUrl
  mql.fetchFromApi = fetchFromApi
  mql.mapRules = mapRules
  mql.version = VERSION
  mql.stream = got.stream
  mql.buffer = createMql({ responseType: 'buffer' })

  return mql
}

module.exports = factory
