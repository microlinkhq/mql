import './browser-globals'

import mqlLightweight from '../src/lightweight'
import mqlNode from '../src/node'

export default [
  { constructor: mqlNode, target: 'node' },
  { constructor: mqlLightweight, target: 'lightweight' }
]
