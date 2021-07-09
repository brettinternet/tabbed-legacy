module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.svelte'],
  },
  plugins: [
    '@typescript-eslint',
    'jest',
    // https://github.com/sveltejs/eslint-plugin-svelte3/blob/master/OTHER_PLUGINS.md
    'svelte3',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'eslint-plugin-jest',
  ],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  settings: {
    'svelte3/typescript': true,
  },
}
