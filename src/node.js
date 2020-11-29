module.exports = require('./factory')({
  MicrolinkError: require('whoops')('MicrolinkError'),
  isUrlHttp: require('is-url-http/lightweight'),
  stringify: require('querystring').stringify,
  got: require('got'),
  flatten: require('flattie').flattie,
  VERSION: require('../package.json').version
})
