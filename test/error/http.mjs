'use strict'

import { listen } from 'async-listen'
import http from 'http'
import test from 'ava'

import mql from '@microlink/mql'

const createServer = handler => {
  const server = http.createServer(handler)
  return server
}

test('error body is preserved from JSON response', async t => {
  const server = createServer((req, res) => {
    res.statusCode = 422
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({
      status: 'fail',
      data: { url: 'URL is not valid' },
      code: 'EINVALURL',
      message: 'URL is not valid',
      more: 'https://microlink.io/einvalurl',
      url: 'https://example.com'
    }))
  })
  t.teardown(() => new Promise(resolve => server.close(resolve)))

  const endpoint = await listen(server)

  const error = await t.throwsAsync(
    mql('https://example.com', { endpoint, retry: 0 }),
    { instanceOf: mql.MicrolinkError }
  )

  t.is(error.code, 'EINVALURL')
  t.is(error.status, 'fail')
  t.is(error.message, 'EINVALURL, URL is not valid')
  t.is(error.statusCode, 422)
  t.truthy(error.data)
})

test('error body is preserved from plain text response', async t => {
  const server = createServer((req, res) => {
    res.statusCode = 503
    res.end('503 Service Unavailable')
  })
  t.teardown(() => new Promise(resolve => server.close(resolve)))

  const endpoint = await listen(server)

  const error = await t.throwsAsync(
    mql('https://microlink.io', { endpoint, retry: 0 }),
    { instanceOf: mql.MicrolinkError }
  )

  t.is(error.statusCode, 503)
  t.is(error.code, 'EFATALCLIENT')
  t.is(error.status, 'error')
  t.truthy(error.data)
  t.truthy(error.message)
})

test('error body is preserved from empty response', async t => {
  const server = createServer((req, res) => {
    res.statusCode = 500
    res.end()
  })
  t.teardown(() => new Promise(resolve => server.close(resolve)))

  const endpoint = await listen(server)

  const error = await t.throwsAsync(
    mql('https://microlink.io', { endpoint, retry: 0 }),
    { instanceOf: mql.MicrolinkError }
  )

  t.is(error.statusCode, 500)
  t.truthy(error.message)
})

test('beforeRequest hook is called', async t => {
  let called = false

  const server = createServer((req, res) => {
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({
      status: 'success',
      data: { url: req.url },
      url: req.url
    }))
  })
  t.teardown(() => new Promise(resolve => server.close(resolve)))

  const endpoint = await listen(server)

  const hooks = {
    beforeRequest: [
      () => { called = true }
    ]
  }

  await mql('https://microlink.io', { endpoint, retry: 0 }, { hooks })
  t.true(called)
})

test('afterResponse hook is called', async t => {
  let called = false

  const server = createServer((req, res) => {
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({
      status: 'success',
      data: { url: req.url },
      url: req.url
    }))
  })
  t.teardown(() => new Promise(resolve => server.close(resolve)))

  const endpoint = await listen(server)

  const hooks = {
    afterResponse: [
      (...args) => {
        called = true
        // ky v1: (request, options, response) → return response
        // ky v2: ({request, options, response}) → return response
        const response = args.length === 1 ? args[0].response : args[2]
        return response
      }
    ]
  }

  await mql('https://microlink.io', { endpoint, retry: 0 }, { hooks })
  t.true(called)
})

test('beforeRetry hook is called on retry', async t => {
  let count = 0

  const server = createServer((req, res) => {
    res.statusCode = 500
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({
      status: 'error',
      data: { url: 'error' },
      code: 'EFATAL',
      message: 'Server error'
    }))
  })
  t.teardown(() => new Promise(resolve => server.close(resolve)))

  const endpoint = await listen(server)

  const hooks = {
    beforeRetry: [
      () => { count++ }
    ]
  }

  await t.throwsAsync(
    mql('https://microlink.io', { endpoint }, { retry: 1, hooks }),
    { instanceOf: mql.MicrolinkError }
  )

  t.is(count, 1)
})
