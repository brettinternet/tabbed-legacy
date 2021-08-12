import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import zip from 'rollup-plugin-zip'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import sveltePreprocess from 'svelte-preprocess'
import typescript from '@rollup/plugin-typescript'
import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension'
import { emptyDir } from 'rollup-plugin-empty-dir'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import alias from '@rollup/plugin-alias'
import image from '@rollup/plugin-image'
const pkg = require('./package.json')

const production = !process.env.ROLLUP_WATCH
const environment = production ? 'production' : 'staging'

export default {
  input: production ? 'src/manifest.json' : 'src/manifest-dev.json',
  output: {
    // TODO: add banner license
    // banner: '/*  */',
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    // always put chromeExtension() before other plugins
    chromeExtension({ browserPolyfill: true }),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(environment),
        'process.env.BUILD_TIME': () => JSON.stringify(new Date().getTime()),
        'process.env.BUILD_VERSION': JSON.stringify(pkg.version),
        'process.env.APP_NAME': JSON.stringify(
          pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1)
        ),
      },
    }),
    alias({
      entries: [
        {
          find: 'src',
          replacement: 'src',
        },
      ],
    }),
    resolve({
      dedupe: ['svelte'],
    }),
    simpleReloader(),
    svelte({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        dev: !production,
      },
    }),
    postcss({ minimize: production }),
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    commonjs(),
    typescript({ sourceMap: false }),
    // Empties the output dir before a new build
    emptyDir(),
    json(),
    image(),
    production && terser(),
    production && zip({ dir: 'releases' }),
  ],
}
