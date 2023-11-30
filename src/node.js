const mql = require('./factory')({
  MicrolinkError: require('whoops')('MicrolinkError'),
  urlHttp: require('url-http/lightweight'),
  got: require('got').extend({ headers: { 'user-agent': undefined } }),
  flatten: require('flattie').flattie,
  VERSION: require('../package.json').version
})

module.exports = mql
module.exports.buffer = mql.extend({ responseType: 'buffer' })
module.exports.render = (input, { width = '650px' } = {}) => {
  if (input && input.url && input.type) {
    return `<img width="${width}" src="${input.url}" />`
  }
  return input
}
