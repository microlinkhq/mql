import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
import babel from 'rollup-plugin-babel'
import fs from 'fs'

const babelRc = JSON.parse(fs.readFileSync('./.babelrc'))

const name = 'mql'

export default [
  // UMD
  {
    input: './src/browser.js',
    output: { name, format: 'umd', file: `dist/umd/index.js` },
    plugins: [
      builtins(),
      resolve({
        module: true,
        jsnext: true,
        main: true,
        browser: true,
        extensions: ['.js']
      }),
      commonjs(),
      babel(babelRc),
      terser(),
      filesize()
    ]
  }
]
