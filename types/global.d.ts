/**
 * `rollup-plugin-chrome-extension` provides polyfill
 * for promisifying WebExtension APIs
 * https://github.com/mozilla/webextension-polyfill
 *
 * Use this type
 *
 * @source https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/firefox-webext-browser
 */
import '@types/firefox-webext-browser'
import '@types/chrome'

declare global {
  /**
   * Used to check specific disparities between Chrome and Firefox APIs
   * "app" is available to all Chromium browsers
   * Don't use this namespace normally
   *
   * @source https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/chrome/index.d.ts
   */
  namespace chrome {
    export const app: unknown
  }

  /**
   * For optional props in a svelte component that have no default value
   * Defined globally since it's used so frequently
   */
  type OptionalProp<T> = T | undefined
}
