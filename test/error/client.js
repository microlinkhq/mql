'use strict'

import test from 'ava'

import clients from '../clients'

clients.forEach(({ constructor: mql, target }) => {
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
})
