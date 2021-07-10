import type { Config } from '@jest/types'

/**
 * @docs https://jestjs.io/docs/configuration
 */
const config: Config.InitialOptions = {
  transform: {
    "^.+\\.svelte$": [
      "svelte-jester",
      {
        preprocess: true
      }
    ],
    "^.+.js$": "babel-jest",
    "^.+.ts$": "ts-jest",
    "^.+\\.js$": "babel-jest"
  },
  moduleFileExtensions: ["js", "ts", "svelte"],
  moduleDirectories: [
    'node_modules',
    // Allows for absolute imports at `src`
    '<rootDir>'
  ],
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  moduleNameMapper: {
    '\\.(jpg|png|svg)$': '<rootDir>/test/assets-transformer.ts',
  },
}

export default config
