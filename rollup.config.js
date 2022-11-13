import nodeResolve from '@rollup/plugin-node-resolve'
import { visualizer } from 'rollup-plugin-visualizer'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'

const build = ({ format, file }) => {
  const compress = file.includes('.min.')

  return {
    input: './src/browser.js',
    output: {
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
      nodeResolve({
        mainFields: ['browser', 'module', 'main']
      }),
      commonjs(),
      compress && terser(),
      filesize(),
      visualizer()
    ]
  }
}

const builds = [
  build({ format: 'umd', file: 'dist/mql.js' }),
  build({ format: 'umd', file: 'dist/mql.min.js' }),
  build({ format: 'es', file: 'dist/mql.mjs' }),
  build({ format: 'es', file: 'dist/mql.min.mjs' })
]

export default builds
