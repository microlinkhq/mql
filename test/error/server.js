'use strict'

import test from 'ava'
import mqlBrowser from '../../src/browser'
import mqlNode from '../../src/node'
  ;[
  { constructor: mqlNode, target: 'node' },
  { constructor: mqlBrowser, target: 'browser' }
].forEach(({ constructor: mql, target }) => {
  test(`${target} » server errors follow the same interface`, async t => {
    const error = await t.throwsAsync(
      mql('https://microlink.io', { ttl: 100 }),
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
