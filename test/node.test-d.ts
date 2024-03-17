import mql from '../src/node'

/** response */

;(async () => {
  const result = await mql('https://example.com', { meta: true })
  console.log(result.status)
  console.log(result.statusCode)
  console.log(result.headers)
  console.log(result.response)
  console.log(result.response.isFromCache)
})()

;(async () => {
  const response = await mql('https://example.com', {
    stream: true,
    screenshot: true
  })
  console.log(response.body)
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
