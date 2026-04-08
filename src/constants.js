'use strict'

const VERSION = require('../package.json').version

module.exports = {
  VERSION,
  USER_AGENT: `mql/${VERSION}`,
  /**
   * Based on Ky default retry status codes, excluding 429:
   * https://github.com/sindresorhus/ky/blob/main/source/core/constants.ts
   */
  RETRY_STATUS_CODES: [408, 413, 500, 502, 503, 504, 521, 522, 524],
  /**
   * Based on Ky default Retry-After status codes, excluding 429:
   * https://github.com/sindresorhus/ky/blob/main/source/core/constants.ts
   */
  RETRY_AFTER_STATUS_CODES: [413, 503]
}
