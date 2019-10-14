import nodeResolve from 'rollup-plugin-node-resolve'
import visualizer from 'rollup-plugin-visualizer'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
import replace from 'rollup-plugin-replace'
import alias from 'rollup-plugin-alias'
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
        'process.env.NODE_ENV': JSON.stringify('production'),
        __VERSION__: require('./package.json').version
      }),
      alias({
        entries: [{ find: 'ky-universal', replacement: './ky-umd' }]
      }),
      shim({
        'clean-stack': 'export default str => str'
      }),
      nodeResolve({
        mainFields: ['browser', 'module', 'main']
      }),
      commonjs(),
      compress && terser({ sourcemap: true }),
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
