import browser from '@types/firefox-webext-browser'

declare global {
  interface Window {
    /**
     * `rollup-plugin-chrome-extension` provides polyfill
     * for promisifying WebExtension APIs
     * https://github.com/mozilla/webextension-polyfill
     */
    browser: browser
  }

  /**
   * For optional props in a svelte component that have no default value
   */
  type OptionalProp<T> = T | undefined
}
