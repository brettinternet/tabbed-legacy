// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/connect
// https://developer.chrome.com/docs/extensions/mv3/messaging/

export const backgroundPort = browser.runtime.connect({ name: 'background' })
