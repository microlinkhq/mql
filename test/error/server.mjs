'use strict'

import { listen } from 'async-listen'
import http from 'http'
import test from 'ava'

import mql from '@microlink/mql'

test('server side unexpected', async t => {
  const server = http.createServer((req, res) => {
    res.statusCode = 503
    res.end('503 Service Unavailable')
  })
  t.teardown(async () => {
    await new Promise(resolve => server.close(resolve))
  })

  const endpoint = await listen(server)

  const error = await t.throwsAsync(
    mql('https://microlink.io', { endpoint, retry: 0 }),
    {
      instanceOf: mql.MicrolinkError
    }
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

test('server side generic error', async t => {
  const error = await t.throwsAsync(
    mql('https://microlink.io', { ttl: 100, retry: 0 }),
    {
      instanceOf: mql.MicrolinkError
    }
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

test('server side timeout', async t => {
  const error = await t.throwsAsync(
    mql('https://kikobeats.com', {
      timeout: 50,
      force: true,
      screenshot: true
    }, { retry: 0 }),
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

test('EINVALURL', async t => {
  const error = await t.throwsAsync(mql('https://invalid-link', {}), {
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
