'use strict'

import test from 'ava'
import mqlBrowser from '../../src/browser'
import mqlNode from '../../src/node'
;[
  { constructor: mqlNode, target: 'node' },
  { constructor: mqlBrowser, target: 'browser' }
].forEach(({ constructor: mql, target }) => {
  test(`${target} » server side generic error`, async t => {
    const error = await t.throwsAsync(
      mql('https://microlink.io', { ttl: 100, retry: 0 }),
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
  test(`${target} » server side timeout`, async t => {
    const error = await t.throwsAsync(
      mql('https://www.twitch.tv/shroud/clip/AuspiciousTubularBunnyFUNgineer', {
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
