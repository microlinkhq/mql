'use strict'

import { createRequire } from 'module'
import { $ } from 'execa'
import test from 'ava'

const require = createRequire(import.meta.url)
const pkg = require('../package.json')

const evalScript = code => $`node -e ${code}`

test('cjs', async t => {
  // eslint-disable-next-line no-template-curly-in-string
  const code = "console.log(`mql v${require('@microlink/mql').version}`)"
  const { stdout } = await evalScript(code)
  t.is(stdout, `mql v${pkg.version}`)
})
