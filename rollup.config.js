import replace from '@rollup/plugin-replace'
const pkg = require('./package.json')

const production = !process.env.ROLLUP_WATCH
const environment = production ? 'production' : 'staging'

export default {
  input: "src/manifest.json",
  output: {
    dir: "dist",
    format: "esm",
  },
  plugins: [
    // always put chromeExtension() before other plugins
    chromeExtension(),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(environment),
        'process.env.BUILD_TIME': () => JSON.stringify(new Date().getTime()),
        'process.env.BUILD_VERSION': JSON.stringify(pkg.version),
        'process.env.APP_NAME': JSON.stringify(pkg.name),
      },
    }),
    simpleReloader(),
    svelte({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    postcss({ minimize: production }),
    // the plugins below are optional
    resolve({
      dedupe: ["svelte"],
    }),
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    commonjs(),
    typescript({ sourceMap: false }),
    // Empties the output dir before a new build
    emptyDir(),
    // If we're building for production, minify
    production && terser(),
    // Outputs a zip file in ./releases
    production && zip({ dir: "releases" }),
  ],
};
