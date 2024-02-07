'use strict'

import test from 'ava'

import clients from './clients.mjs'

clients.forEach(({ constructor: mql, target }) => {
  test(`${target} » url without query params`, t => {
    t.snapshot(mql.getApiUrl('https://kikobeats.com'))
  })

  test(`${target} » apiKey`, t => {
    t.snapshot(mql.getApiUrl('https://kikobeats.com', { apiKey: 'foobar' }))
  })

  test(`${target} » flatten options`, t => {
    t.snapshot(mql.getApiUrl('https://kikobeats.com', { overlay: { browser: 'dark' } }))
  })

  test(`${target} » don't pass null`, t => {
    t.snapshot(mql.getApiUrl('https://kikobeats.com', { colorScheme: undefined }))
    t.snapshot(mql.getApiUrl('https://kikobeats.com', { colorScheme: null }))
  })

  test(`${target} » don't pass undefined`, t => {
    t.snapshot(mql.getApiUrl('https://kikobeats.com', { colorScheme: undefined }))
    t.snapshot(mql.getApiUrl('https://kikobeats.com', { colorScheme: null }))
  })

  test(`${target} » timeout`, t => {
    t.snapshot(mql.getApiUrl('https://kikobeats.com', { timeout: 15000 }))
    t.snapshot(mql.getApiUrl('https://kikobeats.com', { timeout: 28000 }))
  })

  test(`${target} » waitUntil`, t => {
    t.snapshot(mql.getApiUrl('https://kikobeats.com', { waitUntil: 'load' }))
    t.snapshot(mql.getApiUrl('https://kikobeats.com', { waitUntil: ['load', 'networkidle0'] }))
  })

  test(`${target} » undefined`, t => {
    t.snapshot(mql.getApiUrl('https://kikobeats.com', { waitUntil: undefined }))
    t.snapshot(mql.getApiUrl('https://kikobeats.com', { screenshot: { element: '#screenshot', type: undefined } }))
  })
})
