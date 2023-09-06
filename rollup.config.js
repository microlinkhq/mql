import nodeResolve from '@rollup/plugin-node-resolve'
import { visualizer } from 'rollup-plugin-visualizer'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import replace from '@rollup/plugin-replace'
import rewrite from 'rollup-plugin-rewrite'
import terser from '@rollup/plugin-terser'
import MagicString from 'magic-string'

const rewriteFlattie = () =>
  rewrite({
    find: /.* from 'flattie'/gm,
    replace: (match) => new MagicString(match[0])
      .replace('import', 'import * as')
      .toString()
  })

const build = ({ input, output, plugins = [], compress }) => {
  return {
    input,
    output,
    plugins: [
      replace({
        values: {
          "require('../package.json').version": "'__MQL_VERSION__'",
          __MQL_VERSION__: require('./package.json').version
        }
      }),
      commonjs(),
      ...plugins,
      compress && terser(),
      filesize(),
      visualizer()
    ]
  }
}

const builds = [
  build({
    input: './src/node.js',
    output: { file: 'dist/node.mjs', format: 'es' },
    plugins: [rewriteFlattie()]
  }),
  build({
    compress: true,
    input: 'src/lightweight.js',
    output: { file: 'lightweight/index.js', format: 'es' },
    plugins: [
      rewriteFlattie(),
      nodeResolve({
        mainFields: ['browser', 'module', 'main']
      })
    ]
  })
]

export default builds
