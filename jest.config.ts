import type { Config } from '@jest/types'

/**
 * @docs https://jestjs.io/docs/configuration
 */
const config: Config.InitialOptions = {
  globals: {
    // See global.d.ts
    browser: true,
  },
  transform: {
    '^.+\\.svelte$': [
      'svelte-jester',
      {
        preprocess: true,
      },
    ],
    '^.+.js$': 'babel-jest',
    '^.+.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!jest-webextension-mock)'],
  moduleFileExtensions: ['js', 'ts', 'svelte'],
  moduleDirectories: [
    'node_modules',
    // Allows for absolute imports at `src`
    '<rootDir>',
  ],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  moduleNameMapper: {
    '^.+\\.css$': '<rootDir>/test/css-stub.ts',
  },
}

export default config
