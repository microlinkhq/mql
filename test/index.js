'use strict'

import test from 'ava'
import MQL from '..'

test('simple url', async t => {
  const { status, data, response } = await MQL('https://kikobeats.com')
  t.snapshot(status)
  t.snapshot(data)
  t.snapshot(response.url)
})
