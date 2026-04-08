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

const isURL = url => {
  try {
    return /^https?:\/\//i.test(new URL(url).href)
  } catch (_) {
    return false
  }
}

const factory = streamResponseType => ({
  VERSION,
  MicrolinkError,
  got,
  flatten
}) => {
  const assertUrl = (url = '') => {
    if (!isURL(url)) {
      const message = `The \`url\` as \`${url}\` is not valid. Ensure it has protocol (http or https) and hostname.`
      throw new MicrolinkError({
        status: 'fail',
        data: { url: message },
        more: 'https://microlink.io/einvalurlclient',
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
      return opts.responseType === streamResponseType
        ? response
        : { ...response.body, response }
    } catch (error) {
      const { response = {} } = error
      const { statusCode: responseStatusCode, status } = response
      const {
        body: rawBody,
        headers: responseHeaders = {},
        url: uri = apiUrl
      } = response
      const statusCode = responseStatusCode ?? status
      const headers =
        responseHeaders != null && typeof responseHeaders.entries === 'function'
          ? Array.from(responseHeaders.entries()).reduce(
            (acc, [key, value]) => {
              acc[key] = value
              return acc
            },
            {}
          )
          : responseHeaders
      let bodyInput = rawBody
      const isBodyReadableStream =
        bodyInput != null && typeof bodyInput.getReader === 'function'
      if (
        (bodyInput === undefined || isBodyReadableStream) &&
        typeof response.text === 'function'
      ) {
        try {
          bodyInput = await response.text()
        } catch (_) {
          bodyInput = undefined
        }
      }
      const isBodyBuffer = isBuffer(bodyInput)

      const body =
        isObject(bodyInput) && !isBodyBuffer
          ? bodyInput
          : parseBody(
            isBodyBuffer ? bodyInput.toString() : bodyInput,
            error,
            uri
          )

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
    { data, apiKey, endpoint, ...opts } = {},
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

    if (opts.stream) {
      responseType = streamResponseType
    }
    return [apiUrl, { ...gotOpts, responseType, headers }]
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
