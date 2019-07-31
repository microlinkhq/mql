'use strict'

import test from 'ava'
import mqlBrowser from '../src/browser'
import mqlNode from '../src/node'
;[
  { constructor: mqlNode, target: 'node' },
  { constructor: mqlBrowser, target: 'browser' }
].forEach(({ constructor: mql, target }) => {
  test(`${target} » empty url`, async t => {
    const error = await t.throwsAsync(mql(), { instanceOf: mql.MicrolinkError })
    t.is(error.code, 'ENOVALIDURL')
    t.is(error.url, '')
    t.is(error.description, 'The URL `` is not valid. Ensure it has protocol (http or https) and hostname.')
  })

  test(`${target} » invalid url`, async t => {
    const error = await t.throwsAsync(mql('pacopepe'), {
      instanceOf: mql.MicrolinkError
    })
    t.is(error.url, 'pacopepe')
    t.is(error.code, 'ENOVALIDURL')
    t.is(
      error.description,
      'The URL `pacopepe` is not valid. Ensure it has protocol (http or https) and hostname.'
    )
  })

  test(`${target} » fail status`, async t => {
    const error = await t.throwsAsync(
      mql('https://kikobeats.com', {
        timeout: 500,
        screenshot: true,
        video: true,
        waitFor: 40000,
        force: true,
        retry: false
      }),
      {
        instanceOf: mql.MicrolinkError
      }
    )

    t.true(!!error.status)
    t.true(!!error.code)
    t.true(!!error.message)
    t.true(!!error.url)
    t.true(!!error.statusCode)
  })
})
