'use strict'

import test from 'ava'

import clients from './clients.mjs'

clients.forEach(({ constructor: mql, target }) => {
  test(`${target} » url`, async t => {
    const { status, data, response } = await mql(
      'https://kikobeats.com?ref=mql'
    )
    const { date, ...restData } = data

    t.snapshot(status)
    t.snapshot(restData)
    t.snapshot(response.url)
    t.snapshot(response.statusCode)
  })

  test(`${target} » stream`, async t => {
    const response = await mql(
      'https://kikobeats.com?ref=mql', {
        screenshot: { optimizedForSpeed: true },
        stream: true
      }
    )

    t.is(typeof response.headers, 'object')
    t.is(typeof response.statusCode, 'number')
    t.is(typeof response.url, 'string')

    if (target === 'node') {
      t.true(Buffer.isBuffer(response.body))
      t.is(typeof response.isFromCache, 'boolean')
    } else {
      t.true((response.body instanceof ArrayBuffer))
    }
  })

  if (target === 'node') {
    test('node » cache support', async t => {
      const cache = new Map()
      let data
      data = await mql('https://kikobeats.com?ref=mql', { cache })
      t.is(data.response.isFromCache, false)
      data = await mql('https://kikobeats.com?ref=mql', { cache })
      t.is(data.response.isFromCache, true)
    })
  }
})
