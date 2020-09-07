'use strict'

import listen from 'test-listen'
import http from 'http'
import test from 'ava'

import mqlBrowser from '../../src/browser'
import mqlNode from '../../src/node'
;[
  { constructor: mqlNode, target: 'node' },
  { constructor: mqlBrowser, target: 'browser' }
].forEach(({ constructor: mql, target }) => {
  test(`${target} » server side unexpected`, async t => {
    const server = http.createServer((req, res) => {
      res.statusCode = 503
      res.end('503 Service Unavailable')
    })

    const endpoint = await listen(server)

    const error = await t.throwsAsync(mql('https://microlink.io', { endpoint, retry: 0 }), {
      instanceOf: mql.MicrolinkError
    })

    t.true(!!error.url)
    t.true(!!error.code)
    t.true(!!error.status)
    t.true(!!error.more)
    t.true(!!error.statusCode)
    t.true(!!error.data)
    t.true(!!error.message)
    t.true(!!error.description)
  })
  test(`${target} » server side generic error`, async t => {
    const error = await t.throwsAsync(mql('https://microlink.io', { ttl: 100, retry: 0 }), {
      instanceOf: mql.MicrolinkError
    })

    t.true(!!error.url)
    t.true(!!error.code)
    t.true(!!error.status)
    t.true(!!error.more)
    t.true(!!error.statusCode)
    t.true(!!error.data)
    t.true(!!error.message)
    t.true(!!error.description)
  })
  test(`${target} » server side timeout`, async t => {
    const error = await t.throwsAsync(
      mql('https://kikobeats.com', {
        timeout: 50,
        force: true,
        screenshot: true,
        retry: 0
      }),
      { instanceOf: mql.MicrolinkError }
    )

    t.true(!!error.url)
    t.true(!!error.code)
    t.true(!!error.status)
    t.true(!!error.more)
    t.true(!!error.statusCode)
    t.true(!!error.data)
    t.true(!!error.message)
    t.true(!!error.description)
  })
})
