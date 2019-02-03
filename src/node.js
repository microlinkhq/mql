module.exports = require('./factory')({
  whoops: require('whoops'),
  isUrlHttp: require('is-url-http'),
  stringify: require('querystring').stringify,
  got: require('got')
})
