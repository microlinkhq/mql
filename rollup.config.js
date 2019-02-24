import builtins from 'rollup-plugin-node-builtins'
import visualizer from 'rollup-plugin-visualizer'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
import babel from 'rollup-plugin-babel'
import fs from 'fs'

const babelRc = JSON.parse(fs.readFileSync('./.babelrc'))

const name = 'mql'

const umd = () => ({
  input: './src/browser.js',
  output: { name, format: 'umd', file: `dist/mql.umd.js` },
  plugins: [
    builtins(),
    resolve({
      browser: true,
      jsnext: true,
      main: true
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    babel({
      babelrc: false,
      externalHelpers: false,
      ...babelRc
    }),
    terser(),
    filesize()
    // visualizer()
  ]
})

export default [umd()]
