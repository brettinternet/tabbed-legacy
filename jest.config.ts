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
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"]
}

export default config
