import visualizer from 'rollup-plugin-visualizer' // eslint-disable-line
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
import replace from 'rollup-plugin-replace'
import shim from 'rollup-plugin-shim'

const build = ({ file, exports, input, compress, plugins = [] } = {}) => ({
  input,
  output: {
    exports,
    name: 'mql',
    format: 'umd',
    file,
    sourcemap: true
  },
  plugins: [
    ...plugins,
    shim({
      url: 'export default window',
      'clean-stack': 'export default str => str'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __VERSION__: require('./package.json').version
    }),
    resolve({
      mainFields: ['browser', 'module', 'main']
    }),
    commonjs(),
    compress && terser({ sourcemap: true }),
    filesize(),
    visualizer()
  ]
})

export default [
  build({
    file: 'dist/mql.js',
    compress: false,
    input: './src/browser.js'
  }),
  build({
    file: 'dist/mql.min.js',
    compress: true,
    input: './src/browser.js'
  }),
  build({
    file: 'dist/mql.m.js',
    exports: 'named',
    compress: false,
    input: './src/browser.js'
  }),
  build({
    file: 'dist/mql.m.min.js',
    exports: 'named',
    compress: true,
    input: './src/browser.js'
  })
]
