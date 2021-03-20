import './browser-globals'

import mqlBrowser from '../src/browser'
import mqlNode from '../src/node'

export default [
  { constructor: mqlNode, target: 'node' },
  { constructor: mqlBrowser, target: 'browser' }
]
