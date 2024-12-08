import mql, { MicrolinkError } from '../lightweight'
import type { MqlError } from '../lightweight'

/** error  */

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
  console.log(result.response.statusCode)
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

/** data */

mql('https://example.com', {
  data: {
    version: {
      evaluate: 'window.next.version',
      type: 'string'
    }
  }
})

mql('https://github.com/microlinkhq', {
  data: {
    stats: {
      selector: '.application-main',
      attr: {
        followers: {
          selector: '.js-profile-editable-area a[href*="tab=followers"] span',
          type: 'number'
        },
        following: {
          selector: '.js-profile-editable-area a[href*="tab=following"] span',
          type: 'number'
        },
        stars: {
          selector: '.js-responsive-underlinenav a[data-tab-item="stars"] span',
          type: 'number'
        }
      }
    }
  }
})

/** meta */

mql('https://example.com')
mql('https://example.com', { meta: true })
mql('https://example.com', { meta: { logo: { square: true } } })

/** pdf */

mql('https://example.com', { pdf: true })
mql('https://example.com', {
  pdf: {
    format: 'A4',
    width: '480px',
    margin: {
      top: '4mm',
      bottom: '4mm',
      left: '4mm',
      right: '4mm'
    }
  }
})

/** screenshot */

mql('https://example.com', { screenshot: true })
mql('https://example.com', {
  screenshot: {
    codeScheme: 'atom-dark',
    type: 'png',
    optimizeForSpeed: true,
    overlay: {
      background: '#000',
      browser: 'light'
    }
  }
})

/** others */

mql('https://example.com', { click: ['div'] })
mql('https://example.com', {
  adblock: true,
  animations: false,
  audio: true,
  video: true
})

console.log(MicrolinkError)
console.log(mql.version)

/** response */

const result = await mql('https://example.com', { meta: true })
console.log(result.status)
console.log(result.data)
console.log(result.statusCode)
console.log(result.headers)

/** error */
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
;({
  status: 'fail',
  code: 'EAUTH',
  more: 'https://microlink.io/eauth',
  url: 'https://pro.microlink.io?url=https%3A%2F%2Fexample.com%23t%3D1696503754740',
  statusCode: 403,
  headers: {
    'alt-svc': 'h3=":443"; ma=86400',
    'cf-cache-status': 'BYPASS',
    'cf-ray': '81152c548f405e54-MAD',
    connection: 'keep-alive',
    'content-encoding': 'br',
    'content-type': 'application/json',
    date: 'Thu, 05 Oct 2023 11:02:35 GMT',
    nel: '{"success_fraction":0,"report_to":"cf-nel","max_age":604800}',
    'report-to':
      '{"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report\\/v3?s=6tEv%2Fk7XkC0so782muCCxAfbFeaMusFvyv839c8Xv74aKQFy1jD%2Fd8hRrldtfntrhuzCi5HG8W%2FlBxk1a9qKqxHObl79FhxBnK6pAOF6gGXc9Vi0wHnXb1hayCkTxolfpR7yoH89el9W34r1T8E%3D"}],"group":"cf-nel","max_age":604800}',
    server: 'cloudflare',
    'transfer-encoding': 'chunked',
    vary: 'Accept-Encoding',
    via: '1.1 2d741086cf4a760a29245ab77d5fa70a.cloudfront.net (CloudFront)',
    'x-amz-apigw-id': 'MUynzHpvIAMEtpA=',
    'x-amz-cf-id': 'YPxW5fWYSiPgHuOiocQyYkCFoxWDsuV4MtRBh1Yiym3m1b361Q2fgQ==',
    'x-amz-cf-pop': 'MAD56-P2',
    'x-amzn-errortype': 'ForbiddenException',
    'x-amzn-requestid': '7990f38f-d004-49cc-a406-f7cd0cb7df07',
    'x-cache': 'Error from cloudfront'
  },
  name: 'MicrolinkError',
  message:
    'EAUTH, Invalid API key. Make sure you are attaching your API key as `x-api-key` header.',
  description:
    'Invalid API key. Make sure you are attaching your API key as `x-api-key` header.'
} as MqlError)

/* extend */

mql.extend({ responseType: 'text' })

/* stream */

mql.stream('https://example.com', { headers: { 'user-agent': 'foo' } })

/* arrraBuffer */

{
  const response = await mql.arrayBuffer('https://example.com', { meta: false })
  console.log(response.body)
}

/* redirects */

{
  const response = await mql('https://example.com', { meta: false })
  console.log(response.redirects)
}
