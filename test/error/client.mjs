'use strict'

import test from 'ava'

import clients from '../clients.mjs'

clients.forEach(({ constructor: mql, target }) => {
  test(`${target} » EINVALURLCLIENT`, async t => {
    const error = await t.throwsAsync(mql(), { instanceOf: mql.MicrolinkError })

    t.true(error.url === '')
    t.true(error.code === 'EINVALURLCLIENT')
    t.true(error.status === 'fail')
    t.true(error.more === 'https://microlink.io/einvalurlclient')
    t.true(error.statusCode === undefined)
    t.true(!!error.data)
    t.true(!!error.message)
    t.true(!!error.description)
  })

  test(`${target} » EFATALCLIENT`, async t => {
    let count = 0

    const hooks = {
      beforeRetry: [
        () => ++count
      ]
    }

    const error = await t.throwsAsync(
      mql('https://example.com', { endpoint: 'https://notexist.dev', retry: 3 }, { hooks }),
      { instanceOf: mql.MicrolinkError }
    )

    t.is(count, 3)
    t.true(error.url === 'https://notexist.dev?url=https%3A%2F%2Fexample.com')
    t.true(error.code === 'EFATALCLIENT')
    t.true(error.status === 'error')
    t.true(error.more === 'https://microlink.io/efatalclient')
    t.true(error.statusCode === undefined)
    t.true(!!error.data)
    t.true(!!error.message)
    t.true(!!error.description)
  })
})
