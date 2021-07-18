import browser from '@types/firefox-webext-browser'

declare global {
  interface Window {
    browser: browser
  }

  type OptionalProp<T> = T | undefined | null
}
