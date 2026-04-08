'use strict'

import test from 'ava'

import mql from '@microlink/mql'

test('no rules', t => {
  t.deepEqual(mql.mapRules(), undefined)
  t.deepEqual(mql.mapRules(false), undefined)
  t.deepEqual(mql.mapRules('false'), undefined)
  t.deepEqual(mql.mapRules({}), {})
  t.deepEqual(mql.mapRules([]), {})
})

test('object selector', t => {
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

test('single selector', t => {
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

test('multiple selector', t => {
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

test('multiple rules', t => {
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
