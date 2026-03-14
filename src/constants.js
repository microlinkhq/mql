'use strict'

const VERSION = require('../package.json').version

module.exports = {
  VERSION,
  USER_AGENT: `mql/${VERSION}`,
  /**
   * Retry status codes, excluding 429 (too many requests).
   */
  RETRY_STATUS_CODES: [408, 413, 500, 502, 503, 504, 521, 522, 524]
}
