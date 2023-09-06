'use strict'

import test from 'ava'
import toPromise from 'stream-to-promise'

import clients from './clients.mjs'

clients
  .filter(({ target }) => target === 'node')
  .forEach(({ constructor: mql, target }) => {
    test(`${target} » pass headers`, async t => {
      let headers

      const stream = mql.stream('https://cdn.microlink.io/logo/logo.png', {
        headers: {
          accept: 'image/webp'
        }
      })

      stream.on('response', response => {
        headers = response.headers
      })

      await toPromise(stream)

      t.true(['image/webp', 'image/png'].includes(headers['content-type']))
    })
  })
