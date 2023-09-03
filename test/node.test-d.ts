// import { expectType } from 'tsd'

import mql from '..'

/** response */

const result = await mql('https://example.com', { meta: true })
console.log(result.response.isFromCache)

/** stream */

mql.stream('https://example.com', { meta: true })
