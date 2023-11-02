import mqlLightweight from '../lightweight/index.js'
import mqlNode from '../src/node.mjs'

export default [
  { constructor: mqlNode, target: 'node' },
  { constructor: mqlLightweight, target: 'lightweight' }
]
