'use strict'

import test from 'ava'

import mqlBrowser from '../src/browser'
import mqlNode from '../src/node'
;[
  { constructor: mqlNode, target: 'node' },
  { constructor: mqlBrowser, target: 'browser' }
].forEach(({ constructor: mql, target }) => {
  test(`${target} » no rules`, t => {
    t.deepEqual(mql.mapRules(), {})
    t.deepEqual(mql.mapRules({}), {})
    t.deepEqual(mql.mapRules([]), {})
  })

  test(`${target} » object selector`, t => {
    t.deepEqual(
      mql.mapRules({
        avatar: {
          type: 'image',
          selectors: {
            selector: '#avatar',
            attr: 'src'
          }
        }
      }),
      {
        'data.avatar.selectors.selector': '#avatar',
        'data.avatar.selectors.attr': 'src',
        'data.avatar.type': 'image'
      }
    )
  })

  test(`${target} » single selector`, t => {
    t.deepEqual(
      mql.mapRules({
        avatar: {
          type: 'image',
          selectors: [
            {
              selector: '#avatar',
              attr: 'src'
            }
          ]
        }
      }),
      {
        'data.avatar.selectors.0.selector': '#avatar',
        'data.avatar.selectors.0.attr': 'src',
        'data.avatar.type': 'image'
      }
    )
  })

  test(`${target} » multiple selector`, t => {
    t.deepEqual(
      mql.mapRules({
        avatar: {
          type: 'image',
          selectors: [
            {
              selector: '#avatar',
              attr: 'src'
            },
            {
              selector: '.avatar',
              attr: 'href'
            }
          ]
        }
      }),
      {
        'data.avatar.selectors.0.selector': '#avatar',
        'data.avatar.selectors.0.attr': 'src',
        'data.avatar.selectors.1.selector': '.avatar',
        'data.avatar.selectors.1.attr': 'href',
        'data.avatar.type': 'image'
      }
    )
  })

  test(`${target} » multiple rules`, t => {
    t.deepEqual(
      mql.mapRules({
        avatar: {
          type: 'image',
          selectors: [
            {
              selector: '#avatar',
              attr: 'src'
            },
            {
              selector: '.avatar',
              attr: 'href'
            }
          ]
        },
        logo: {
          type: 'image',
          selectors: [
            {
              selector: '#logo',
              attr: 'src'
            },
            {
              selector: '.logo',
              attr: 'href'
            }
          ]
        }
      }),
      {
        'data.avatar.selectors.0.selector': '#avatar',
        'data.avatar.selectors.0.attr': 'src',
        'data.avatar.selectors.1.selector': '.avatar',
        'data.avatar.selectors.1.attr': 'href',
        'data.avatar.type': 'image',
        'data.logo.selectors.0.selector': '#logo',
        'data.logo.selectors.0.attr': 'src',
        'data.logo.selectors.1.selector': '.logo',
        'data.logo.selectors.1.attr': 'href',
        'data.logo.type': 'image'
      }
    )
  })
})
