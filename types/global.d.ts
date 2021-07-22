import browser from '@types/firefox-webext-browser'

declare global {
  interface Window {
    /**
     * `rollup-plugin-chrome-extension` provides polyfill
     * for promisifying WebExtension APIs
     * https://github.com/mozilla/webextension-polyfill
     */
    browser: browser

    /**
     * `chrome.app` is available on Chrome browsers, used
     */
    chrome?: {
      app?: unknown
    }
  }

  /**
   * For optional props in a svelte component that have no default value
   * Defined globally since it's used so frequently
   */
  type OptionalProp<T> = T | undefined
}
