'use strict'

const got = require('got')

const { VERSION, USER_AGENT, RETRY_STATUS_CODES } = require('./constants')

const mql = require('./factory')('buffer')({
  MicrolinkError: require('whoops')('MicrolinkError'),
  got: got.extend({
    headers: { 'user-agent': USER_AGENT },
    retry: { statusCodes: RETRY_STATUS_CODES }
  }),
  flatten: require('flattie').flattie,
  VERSION
})

module.exports = mql
module.exports.buffer = mql.extend({ responseType: 'buffer' })
module.exports.render = (input, { width = '650px' } = {}) => {
  if (input && input.url && input.type) {
    return `<img width="${width}" src="${input.url}" />`
  }
  return input
}
