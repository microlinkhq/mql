import { createRequire } from 'module'
import { $ } from 'execa'
import test from 'ava'

const pkg = createRequire(import.meta.url)('../package.json')

const evalScript = code => $`node --eval ${code}`.then(({ stdout }) => stdout)
evalScript.esm = code => $`node --input-type module --eval ${code}`.then(({ stdout }) => stdout)

const sort = array => array.sort((a, b) => a.localeCompare(b))

test('cjs', async t => {
  // eslint-disable-next-line no-template-curly-in-string
  t.is((await evalScript("console.log(`mql v${require('@microlink/mql').version}`)")), `mql v${pkg.version}`)

  const methods = sort(JSON.parse((await evalScript("console.log(JSON.stringify(Object.keys(require('@microlink/mql'))))"))))
  t.deepEqual(methods,
    [
      'buffer',
      'extend',
      'fetchFromApi',
      'getApiUrl',
      'mapRules',
      'MicrolinkError',
      'render',
      'stream',
      'version'
    ])
})

test('esm', async t => {
  // eslint-disable-next-line no-template-curly-in-string
  t.is((await evalScript.esm("import {version} from '@microlink/mql'; console.log(`mql v${version}`)")), `mql v${pkg.version}`)

  const methods = sort(JSON.parse((await evalScript('import("@microlink/mql").then(mql => console.log(JSON.stringify(Object.keys(mql))))'))))

  t.deepEqual(methods,
    [
      'arrayBuffer',
      'default',
      'extend',
      'fetchFromApi',
      'getApiUrl',
      'mapRules',
      'MicrolinkError',
      'version'
    ]
  )
})
