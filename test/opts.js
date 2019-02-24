'use strict'

import test from 'ava'
import mqlBrowser from '../src/browser'
import mqlNode from '../src/node'
;[{ constructor: mqlNode, target: 'node' }, { constructor: mqlBrowser, target: 'browser' }].forEach(
  ({ constructor: mql, target }) => {
    test(`${target} » url`, async t => {
      const { status, data, response } = await mql('https://kikobeats.com')
      t.snapshot(status)
      t.snapshot(data)
      t.snapshot(response.url)
    })
  }
)

// test('cache support', async t => {
//   const cache = new Map()
//   let data
//   data = await mql('https://kikobeats.com', { cache })
//   t.is(data.response.fromCache, false)
//   data = await mql('https://kikobeats.com', { cache })
//   t.is(data.response.fromCache, true)
// })
