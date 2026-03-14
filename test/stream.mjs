'use strict'

import test from 'ava'

import clients from './clients.mjs'

clients
  .forEach(({ constructor: mql, target }) => {
    test(`${target} » pass headers`, async t => {
      const stream = await mql.stream('https://cdn.microlink.io/logo/logo.png', {
        headers: {
          accept: 'image/webp'
        }
      })

      t.truthy(stream)
      t.is(typeof stream.getReader, 'function')
    })
  })
