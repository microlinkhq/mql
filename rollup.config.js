import visualizer from 'rollup-plugin-visualizer' // eslint-disable-line
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
import alias from 'rollup-plugin-alias'
import replace from 'rollup-plugin-re'
import shim from 'rollup-plugin-shim'

const umd = ({ compress } = {}) => ({
  input: './src/browser.js',
  output: {
    name: 'mql',
    format: 'umd',
    file: compress ? `dist/mql.min.js` : `dist/mql.js`
  },
  plugins: [
    alias({
      'ky-universal': './ky-umd'
    }),
    shim({
      'clean-stack': `export default str => str`
    }),
    replace({
      replaces: {
        '__VERSION__': require('./package.json').version
      }
    }),
    resolve(),
    commonjs(),
    compress && terser(),
    filesize(),
    visualizer()
  ]
})

export default [
  umd(),
  umd({ compress: true })
]
