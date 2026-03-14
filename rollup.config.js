import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'

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
      filesize()
    ].filter(Boolean)
  }
}

const builds = [
  build({
    compress: false,
    input: 'src/index.js',
    output: { file: 'dist/index.js', format: 'es' },
    plugins: [
      nodeResolve({
        mainFields: ['browser', 'module', 'main']
      }),
      commonjs({ strictRequires: 'auto' })
    ]
  }),
  build({
    compress: false,
    input: 'src/index.js',
    output: { name: 'mql', file: 'dist/index.umd.js', format: 'umd' },
    plugins: [
      nodeResolve({
        mainFields: ['browser', 'module', 'main']
      }),
      commonjs({ strictRequires: 'auto' })
    ]
  })
]

export default builds
