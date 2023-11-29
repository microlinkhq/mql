const ENDPOINT = {
  FREE: 'https://api.microlink.io/',
  PRO: 'https://pro.microlink.io/'
}

const isObject = input => input !== null && typeof input === 'object'

const isBuffer = input =>
  input != null &&
  input.constructor != null &&
  typeof input.constructor.isBuffer === 'function' &&
  input.constructor.isBuffer(input)

const parseBody = (input, error, url) => {
  try {
    return JSON.parse(input)
  } catch (_) {
    const message = input || error.message

    return {
      status: 'error',
      data: { url: message },
      more: 'https://microlink.io/efatalclient',
      code: 'EFATALCLIENT',
      message,
      url
    }
  }
}

const factory = ({ VERSION, MicrolinkError, urlHttp, got, flatten }) => {
  const assertUrl = (url = '') => {
    if (!urlHttp(url)) {
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
    return Object.keys(flatRules).reduce((acc, key) => {
      acc[`data.${key}`] = flatRules[key].toString()
      return acc
    }, {})
  }

  const fetchFromApi = async (apiUrl, opts = {}) => {
    try {
      const response = await got(apiUrl, opts)
      return opts.responseType === 'buffer'
        ? { body: response.body, response }
        : { ...response.body, response }
    } catch (err) {
      const { response = {} } = err
      const {
        statusCode,
        body: rawBody,
        headers = {},
        url: uri = apiUrl
      } = response
      const isBodyBuffer = isBuffer(rawBody)

      const body =
        isObject(rawBody) && !isBodyBuffer
          ? rawBody
          : parseBody(isBodyBuffer ? rawBody.toString() : rawBody, err, uri)

      throw new MicrolinkError({
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

    const apiUrl = `${apiEndpoint}?${new URLSearchParams({
      url,
      ...mapRules(data),
      ...flatten(opts)
    }).toString()}`

    const headers = isPro
      ? { ...gotHeaders, 'x-api-key': apiKey }
      : { ...gotHeaders }
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
  mql.extend = createMql
  mql.MicrolinkError = MicrolinkError
  mql.getApiUrl = getApiUrl
  mql.fetchFromApi = fetchFromApi
  mql.mapRules = mapRules
  mql.version = VERSION
  mql.stream = got.stream

  return mql
}

module.exports = factory
