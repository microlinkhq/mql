const ENDPOINT = {
  FREE: 'https://api.microlink.io',
  PRO: 'https://pro.microlink.io'
}

const isObject = input => input !== null && typeof input === 'object'

const parseBody = (input, error, url) => {
  try {
    return JSON.parse(input)
  } catch (_) {
    const message = input || error.message

    return {
      status: 'error',
      data: { url: message },
      more: 'https://microlink.io/efatal',
      code: 'EFATAL',
      message,
      url
    }
  }
}

const factory = ({ VERSION, MicrolinkError, isUrlHttp, stringify, got, flatten }) => {
  const assertUrl = (url = '') => {
    if (!isUrlHttp(url)) {
      const message = `The \`url\` as \`${url}\` is not valid. Ensure it has protocol (http or https) and hostname.`
      throw new MicrolinkError({
        status: 'fail',
        data: { url: message },
        more: 'https://microlink.io/docs/api/api-parameters/url',
        code: 'EINVALURLCLIENT',
        message,
        url
      })
    }
  }

  const mapRules = rules => {
    if (!isObject(rules)) return
    const flatRules = flatten(rules)
    return Object.keys(flatRules).reduce(
      (acc, key) => ({ ...acc, [`data.${key}`]: flatRules[key] }),
      {}
    )
  }

  const fetchFromApi = async (apiUrl, opts = {}) => {
    try {
      const response = await got(apiUrl, opts)
      return opts.responseType === 'buffer'
        ? { body: response.body, response }
        : { ...response.body, response }
    } catch (err) {
      const { response = {} } = err
      const { statusCode, body: rawBody, headers, url: uri = apiUrl } = response

      const body =
        isObject(rawBody) && !Buffer.isBuffer(rawBody) ? rawBody : parseBody(rawBody, err, uri)

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
    { responseType = 'json', headers: gotHeaders, ...gotOpts } = {}
  ) => {
    const isPro = !!apiKey
    const apiEndpoint = endpoint || ENDPOINT[isPro ? 'PRO' : 'FREE']

    const apiUrl = `${apiEndpoint}?${stringify({
      url,
      ...mapRules(data),
      ...flatten(opts)
    })}`

    const headers = isPro ? { ...gotHeaders, 'x-api-key': apiKey } : { ...gotHeaders }
    return [apiUrl, { ...gotOpts, responseType, cache, retry, headers }]
  }

  const createMql = defaultOpts => async (url, opts, gotOpts) => {
    assertUrl(url)
    const [apiUrl, fetchOpts] = getApiUrl(url, opts, {
      ...defaultOpts,
      ...gotOpts
    })
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
