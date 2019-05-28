'use strict'

import test from 'ava'

import mqlBrowser from '../src/browser'
import mqlNode from '../src/node'
  ;[
  { constructor: mqlNode, target: 'node' },
  { constructor: mqlBrowser, target: 'browser' }
].forEach(({ constructor: mql, target }) => {
  test(`${target} » url`, async t => {
    const { status, data, response } = await mql(
      'https://kikobeats.com?ref=mql'
    )
    const { date, ...restData } = data
    t.snapshot(status)
    t.snapshot(restData)
    t.snapshot(response.url)
  })

  if (target === 'node') {
    test('node » cache support', async t => {
      const cache = new Map()
      let data
      data = await mql('https://kikobeats.com?ref=mql', { cache })
      t.is(data.response.fromCache, false)
      data = await mql('https://kikobeats.com?ref=mql', { cache })
      t.is(data.response.fromCache, true)
    })
  }
})
