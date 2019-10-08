'use strict'

import test from 'ava'
import mqlBrowser from '../src/browser'
import mqlNode from '../src/node'
;[
  { constructor: mqlNode, target: 'node' },
  { constructor: mqlBrowser, target: 'browser' }
].forEach(({ constructor: mql, target }) => {
  test(`${target} » url without query params`, t => {
    t.snapshot(mql.getApiUrl('https://kikobeats.com'))
  })

  test(`${target} » apiKey`, t => {
    t.snapshot(mql.getApiUrl('https://kikobeats.com', { apiKey: 'foobar' }))
  })
})
