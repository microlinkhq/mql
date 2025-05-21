import mql, { MicrolinkError, version } from '../src/node'
import type { MqlError } from '../lightweight'

/** version */

;(async () => {
  console.log(version)
})()

/** error  */

;({
  status: 'error',
  data: { url: 'fetch failed' },
  more: 'https://microlink.io/efatalclient',
  code: 'EFATALCLIENT',
  url: 'https://localhost.microlink.io?url=https%3A%2F%2Fexample.com%23t%3D1696503516588',
  statusCode: undefined,
  headers: {},
  name: 'MicrolinkError',
  message: 'EFATALCLIENT, fetch failed',
  description: 'fetch failed'
} as MqlError)

;(async () => {
  const error = new MicrolinkError({
    status: 'fail',
    data: { url: 'something goes wrong' },
    more: 'https://microlink.io/einvalurlclient',
    code: 'EINVALURLCLIENT',
    message: 'something goes wrong',
    url: 'https://example.com'
  })

  console.log(error.status)
  console.log(error.data)
  console.log(error.more)
  console.log(error.code)
  console.log(error.url)
  console.log(error.description)
})()

/** mql */

;(async () => {
  const result = await mql('https://example.com', {
    endpoint: 'https://pro.microlink.io',
    apiKey: '123',
    retry: 2,
    cache: new Map()
  })

  console.log(result.status)
  console.log(result.data)
  console.log(result.headers)
  console.log(result.response)
  console.log(result.response.isFromCache)
})()

;(async () => {
  const response = await mql('https://example.com', {
    stream: 'screenshot',
    screenshot: true
  })
  console.log(response.url)
  console.log(response.body)
  console.log(response.headers)
  console.log(response.statusCode)
})()

/** got options */

await mql(
  'https://example.com',
  { meta: true },
  {
    timeout: 1000
  }
)

/** stream */

mql.stream('https://cdn.microlink.io/logo/logo.png', {
  headers: {
    accept: 'image/webp'
  }
})
