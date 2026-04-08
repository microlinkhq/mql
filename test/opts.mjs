'use strict'

import test from 'ava'

import mql from '@microlink/mql'

test('url', async t => {
  const { status, data, response } = await mql('https://kikobeats.com?ref=mql')
  const { date, ...restData } = data

  t.snapshot(status)
  t.snapshot(restData)
  t.snapshot(response.url)
  t.snapshot(response.statusCode)
})

test('stream', async t => {
  const response = await mql('https://kikobeats.com?ref=mql', {
    screenshot: { optimizedForSpeed: true },
    stream: 'screenshot'
  })

  t.is(typeof response.headers, 'object')
  t.is(typeof response.statusCode, 'number')
  t.is(typeof response.url, 'string')
  t.true(response.body instanceof ArrayBuffer)
})
