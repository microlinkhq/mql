'use strict'

import test from 'ava'
import { apiUrl } from '..'

test('url without query params', t => {
  t.snapshot(apiUrl('https://kikobeats.com'))
})

test('key', t => {
  t.snapshot(apiUrl('https://kikobeats.com', { key: 'foobar' }))
})
