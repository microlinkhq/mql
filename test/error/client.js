'use strict'

import test from 'ava'
import mqlBrowser from '../../src/browser'
import mqlNode from '../../src/node'
;[
  { constructor: mqlNode, target: 'node' },
  { constructor: mqlBrowser, target: 'browser' }
].forEach(({ constructor: mql, target }) => {
  test(`${target} » EINVALURLCLIENT`, async t => {
    const error = await t.throwsAsync(mql(), { instanceOf: mql.MicrolinkError })

    t.true(error.url === '')
    t.true(error.code === 'EINVALURLCLIENT')
    t.true(error.status === 'fail')
    t.true(error.more === 'https://microlink.io/docs/api/api-parameters/url')
    t.true(error.statusCode === undefined)
    t.true(!!error.data)
    t.true(!!error.message)
    t.true(!!error.description)
  })

  test(`${target} » ETIMEOUTCLIENT`, async t => {
    const url = 'https://kikobeats.com'
    const error = await t.throwsAsync(
      mql(url, {
        timeout: 1,
        screenshot: true,
        video: true,
        waitFor: 40000,
        force: true,
        retry: 0
      }),
      {
        instanceOf: mql.MicrolinkError
      }
    )

    t.true(error.url === url)
    t.true(error.code === 'ETIMEOUTCLIENT')
    t.true(error.status === 'fail')
    t.true(error.more === 'https://microlink.io/docs/api/api-parameters/url')
    t.true(error.statusCode === 500)
    t.true(!!error.data)
    t.true(!!error.message)
    t.true(!!error.description)
  })
})
