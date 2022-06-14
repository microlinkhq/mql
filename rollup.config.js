import nodeResolve from '@rollup/plugin-node-resolve'
import visualizer from 'rollup-plugin-visualizer'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
import replace from '@rollup/plugin-replace'
import shim from 'rollup-plugin-shim'

const build = ({ format, exports, input } = {}) => {
  const base = ({ file, compress = false }) => ({
    input,
    output: {
      exports,
      name: 'mql',
      format,
      file,
      sourcemap: true
    },
    plugins: [
      replace({
        values: {
          "const URL = globalThis ? globalThis.URL : require('url').URL":
            'const URL = globalThis.URL',
          __MQL_VERSION__: require('./package.json').version
        }
      }),
      shim({
        'clean-stack': 'export default str => str'
      }),
      nodeResolve({
        mainFields: ['browser', 'module', 'main']
      }),
      commonjs(),
      compress && terser(),
      filesize(),
      visualizer()
    ]
  })

  return [
    base({ file: 'dist/mql.js', compress: false }),
    base({ file: 'dist/mql.min.js', compress: true })
  ]
}

export default build({
  format: 'umd',
  input: './src/browser.js'
})
