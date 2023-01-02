module.exports = require('./factory')({
  MicrolinkError: require('whoops')('MicrolinkError'),
  urlHttp: require('url-http/lightweight'),
  got: require('got'),
  flatten: require('flattie').flattie,
  VERSION: require('../package.json').version
})

module.exports.render = (input, { width = '650px' } = {}) => {
  if (input && input.url && input.type) {
    return `<img width="${width}" src="${input.url}" />`
  }
  return input
}
