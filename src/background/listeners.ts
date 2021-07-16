import { debounce } from 'lodash'
import { readSettings } from 'src/utils/browser/storage'
import {
  MESSAGE_TYPE_RELOAD_ACTIONS,
  MESSAGE_TYPE_RELOAD_TAB_LISTENERS,
} from 'src/utils/messages'
import { setupActions } from './configuration'

const BADGE_BACKGROUND_COLOR = '#3b82f6'

const updateTabCountBadge = async () => {
  let count: number
  const tabs = await browser.tabs.query({})
  count = tabs.length
  await browser.browserAction.setBadgeBackgroundColor({
    color: BADGE_BACKGROUND_COLOR,
  })
  await browser.browserAction.setBadgeText({ text: count ? `${count}` : '' })
}

const clearTabCountBadge = async () => {
  await browser.browserAction.setBadgeText({ text: '' })
}

const updateTabCountDebounce = debounce(updateTabCountBadge, 250)

const setupTabListeners = async () => {
  const settings = await readSettings()
  if (settings.showTabCountBadge) {
    updateTabCountDebounce()
    browser.tabs.onUpdated.addListener(updateTabCountDebounce)
    browser.tabs.onRemoved.addListener(updateTabCountDebounce)
    browser.tabs.onReplaced.addListener(updateTabCountDebounce)
    browser.tabs.onDetached.addListener(updateTabCountDebounce)
    browser.tabs.onAttached.addListener(updateTabCountDebounce)
    browser.tabs.onMoved.addListener(updateTabCountDebounce)
  } else {
    clearTabCountBadge()
    browser.tabs.onUpdated.removeListener(updateTabCountDebounce)
    browser.tabs.onRemoved.removeListener(updateTabCountDebounce)
    browser.tabs.onReplaced.removeListener(updateTabCountDebounce)
    browser.tabs.onDetached.removeListener(updateTabCountDebounce)
    browser.tabs.onAttached.removeListener(updateTabCountDebounce)
    browser.tabs.onMoved.removeListener(updateTabCountDebounce)
  }
}

export const setupListeners = () => {
  setupTabListeners()

  // browser.tabs.onActivated.addListener(handleActiveTabChange)
  // browser.windows.onFocusChanged.addListener(handleFocusWindowChange)
  // browser.windows.onCreated.addListener(fetch)
  // browser.windows.onRemoved.addListener(fetch)

  browser.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    if (message.type === MESSAGE_TYPE_RELOAD_ACTIONS) {
      return new Promise(resolve => {
        setupActions().then(resolve)
      })
    }

    return false
  })

  browser.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    if (message.type === MESSAGE_TYPE_RELOAD_TAB_LISTENERS) {
      return new Promise(resolve => {
        setupTabListeners().then(resolve)
      })
    }

    return false
  })
}
