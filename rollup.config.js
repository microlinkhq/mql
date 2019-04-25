import visualizer from 'rollup-plugin-visualizer' // eslint-disable-line
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
import alias from 'rollup-plugin-alias'
import replace from 'rollup-plugin-re'
import shim from 'rollup-plugin-shim'

const umd = () => ({
  input: './src/browser.js',
  output: {
    name: 'mql',
    format: 'umd',
    file: `src/umd.min.js`
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
        'process.env.MQL_VERSION': require('./package.json').version
      }
    }),
    resolve(),
    commonjs(),
    terser(),
    filesize(),
    visualizer()
  ]
})

export default [umd()]
