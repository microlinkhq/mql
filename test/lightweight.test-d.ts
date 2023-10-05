import mql from '../lightweight'

/** mql */
mql('https://example.com', {
  endpoint: 'https://pro.microlink.io',
  apiKey: '123',
  retry: 2,
  cache: new Map()
})

/**
 * data
 */
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
          selector:
            '.js-responsive-underlinenav a[data-tab-item="stars"] span',
          type: 'number'
        }
      }
    }
  }
})

/**
 * meta
 */
mql('https://example.com')
mql('https://example.com', { meta: true })
mql('https://example.com', { meta: { logo: { square: true } } })

/**
 * pdf
 */
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

/**
 * screenshot
 */
mql('https://example.com', { screenshot: true })
mql('https://example.com', {
  screenshot: {
    codeScheme: 'atom-dark',
    type: 'png',
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

/** response */

const result = await mql('https://example.com', { meta: true })
console.log(result.status)
console.log(result.data)
console.log(result.statusCode)
console.log(result.headers)

/** stream */

// mql.stream('https://example.com', { meta: true })
