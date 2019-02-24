'use strict'

import test from 'ava'
import mqlBrowser from '../src/browser'
import mqlNode from '../src/node'
  ;[{ constructor: mqlNode, target: 'node' }, { constructor: mqlBrowser, target: 'browser' }].forEach(
  ({ constructor: mql, target }) => {
    test(`${target} » empty url`, async t => {
      const error = await t.throwsAsync(mql(), { instanceOf: mql.MicrolinkError })
      t.is(error.code, 'ENOVALIDURL')
      t.is(error.description, 'The `url` value is not a valid HTTP URL.')
    })
    test(`${target} » invalid url`, async t => {
      const error = await t.throwsAsync(mql('pacopepe'), {
        instanceOf: mql.MicrolinkError
      })
      t.is(error.code, 'ENOVALIDURL')
      t.is(error.description, `The \`url\` value 'pacopepe' is not a valid HTTP URL.`)
    })
    test(`${target} » fail status`, async t => {
      const error = await t.throwsAsync(
        mql('https://kikobeats.com', {
          screenshot: true,
          video: true,
          waitFor: 40000,
          force: true
        }),
        {
          instanceOf: mql.MicrolinkError
        }
      )

      t.true(!!error.status)
      t.true(!!error.code)
      t.true(!!error.message)
      t.true(!!error.statusCode)
      t.true(!!error.headers)
      t.true(!!error.body)
    })
  }
)
