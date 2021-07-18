import browser from '@types/firefox-webext-browser'

declare global {
  interface Window {
    browser: browser
  }

  /**
   * For optional props in a svelte component that have no default value
   */
  type OptionalProp<T> = T | undefined
}
