import { createRequire } from 'module'
import { $ } from 'execa'
import test from 'ava'

const pkg = createRequire(import.meta.url)('../package.json')

const evalScript = code => $`node --eval ${code}`
evalScript.esm = code => $`node --input-type module -e ${code}`

test('cjs', async t => {
  // eslint-disable-next-line no-template-curly-in-string
  const code = "console.log(`mql v${require('@microlink/mql').version}`)"
  const { stdout } = await evalScript(code)
  t.is(stdout, `mql v${pkg.version}`)
})

test('esm', async t => {
  // eslint-disable-next-line no-template-curly-in-string
  const code =
    "import {version} from '@microlink/mql'; console.log(`mql v${version}`)"
  const { stdout } = await evalScript.esm(code)
  t.is(stdout, `mql v${pkg.version}`)
})
