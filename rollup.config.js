import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { version } from './package.json'

export default {
  input: 'index.js',
  output: [
    {
      file: `dist/atomax-connector.${version}.js`,
      name: 'AtomaxConnector',
      format: 'iife'
    },
    {
      file: `dist/atomax-connector-es.${version}.js`,
      format: 'es'
    }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true
    }),
    resolve(),
    commonjs()
  ]
}
