import browser from '@types/firefox-webext-browser'

declare global {
  interface Window {
    browser: browser
  }
}
