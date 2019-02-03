'use strict'

import test from 'ava'
import mql from '../src/node'
import { omit } from 'lodash'

const { MicrolinkError } = mql

test('empty url', async t => {
  const error = await t.throwsAsync(mql(), { instanceOf: MicrolinkError })
  t.is(error.code, 'ENOVALIDURL')
  t.is(error.description, 'The `url` value is not a valid HTTP URL.')
})
test('invalid url', async t => {
  const error = await t.throwsAsync(mql('pacopepe'), {
    instanceOf: MicrolinkError
  })
  t.is(error.code, 'ENOVALIDURL')
  t.is(error.description, `The \`url\` value 'pacopepe' is not a valid HTTP URL.`)
})
test('fail status', async t => {
  const error = await t.throwsAsync(
    mql('https://kikobeats.com', {
      screenshot: true,
      video: true,
      waitFor: 40000,
      force: true
    }),
    {
      instanceOf: MicrolinkError
    }
  )

  t.true(!!error.status)
  t.true(!!error.code)
  t.true(!!error.message)
  t.true(!!error.statusCode)
  t.true(!!error.headers)
  t.true(!!error.body)
  t.snapshot(!!error.headers)
  t.snapshot(omit(error, ['headers']))
})
