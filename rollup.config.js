import nodeResolve from '@rollup/plugin-node-resolve'
import { visualizer } from 'rollup-plugin-visualizer'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import replace from '@rollup/plugin-replace'
import rewrite from 'rollup-plugin-rewrite'
import terser from '@rollup/plugin-terser'

const rewriteFlattie = () =>
  rewrite({
    find: /.* from 'flattie'/gm,
    replace: match => match[0].replace('import', 'import * as')
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
      ...plugins,
      compress &&
        terser({
          format: {
            comments: false
          }
        }),
      filesize(),
      visualizer()
    ]
  }
}

const builds = [
  /* This build is just for testing using ESM interface */
  build({
    input: './src/node.js',
    output: { file: 'src/node.mjs', format: 'es' },
    plugins: [commonjs(), rewriteFlattie()]
  }),
  build({
    compress: true,
    input: 'src/lightweight.js',
    output: { file: 'lightweight/index.js', format: 'es' },
    plugins: [
      nodeResolve({
        mainFields: ['browser', 'module', 'main']
      }),
      commonjs()
    ]
  })
]

export default builds
