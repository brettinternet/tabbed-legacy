import { debounce } from 'lodash'
import {
  MESSAGE_TYPE_RELOAD_ACTIONS,
  MESSAGE_TYPE_RELOAD_TAB_LISTENERS,
  MESSAGE_TYPE_UPDATE_LOG_LEVEL
} from 'src/utils/messages'
import type { ReloadActionsMessage, ReloadTabListeners, UpdateLogLevel } from 'src/utils/messages'
import type { Settings } from 'src/utils/settings'
import { updateLogLevel, log } from 'src/utils/logger'
import { setupActions } from './configuration'

const logContext = 'background/listeners'
const BADGE_BACKGROUND_COLOR = '#3b82f6'

const updateTabCountBadge = async () => {
  try {
    log.debug(logContext, 'updateTabCountBadge')
    let count: number
    const tabs = await browser.tabs.query({})
    count = tabs.length
    await browser.browserAction.setBadgeBackgroundColor({
      color: BADGE_BACKGROUND_COLOR,
    })
    await browser.browserAction.setBadgeText({ text: count ? `${count}` : '' })
  } catch (err) {
    log.error(err)
  }
}

const clearTabCountBadge = async () => {
  await browser.browserAction.setBadgeText({ text: '' })
}

const updateTabCountDebounce = debounce(updateTabCountBadge, 250)

const setupTabListeners = async (showTabCountBadge: boolean) => {
  log.debug(logContext, 'setupTabListeners', showTabCountBadge)
  if (showTabCountBadge) {
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

export const setupListeners = async (settings: Settings) => {
  updateLogLevel(settings.debugMode)
  log.debug(logContext, 'setupListeners', settings)
  setupTabListeners(settings.showTabCountBadge)

  browser.runtime.onMessage.addListener((message: ReloadActionsMessage, _sender, _sendResponse) => {
    if (message.type === MESSAGE_TYPE_RELOAD_ACTIONS) {
      setupActions(message.value)
    }

    return false
  })

  browser.runtime.onMessage.addListener(
    (message: ReloadTabListeners, _sender, _sendResponse) => {
      if (message.type === MESSAGE_TYPE_RELOAD_TAB_LISTENERS) {
        setupTabListeners(message.value)
      }

      return false
    }
  )

  browser.runtime.onMessage.addListener(
    (message: UpdateLogLevel, _sender, _sendResponse) => {
      if (message.type === MESSAGE_TYPE_UPDATE_LOG_LEVEL) {
        updateLogLevel(message.value)
      }

      return false
    }
  )
}
