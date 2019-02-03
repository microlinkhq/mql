'use strict'

import test from 'ava'
import MQL from '..'

const { MicrolinkError } = MQL

test('empty url', async t => {
  const error = await t.throwsAsync(MQL(), { instanceOf: MicrolinkError })
  t.is(error.code, 'ENOVALIDURL')
  t.is(error.description, 'The `url` value is not a valid HTTP URL.')
})
test('invalid url', async t => {
  const error = await t.throwsAsync(MQL('pacopepe'), {
    instanceOf: MicrolinkError
  })
  t.is(error.code, 'ENOVALIDURL')
  t.is(
    error.description,
    `The \`url\` value 'pacopepe' is not a valid HTTP URL.`
  )
})
