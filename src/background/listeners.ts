import { debounce } from 'lodash'

import {
  MESSAGE_TYPE_RELOAD_ACTIONS,
  MESSAGE_TYPE_RELOAD_TAB_LISTENERS,
  MESSAGE_TYPE_UPDATE_LOG_LEVEL,
  MESSAGE_TYPE_UPDATE_SESSIONS_LIST,
  MESSAGE_TYPE_GET_SESSIONS_LIST
} from 'src/utils/messages'
import type { ReloadActionsMessage, ReloadTabListenersMessage, UpdateLogLevelMessage, UpdateSessionsListMessage, GetSessionsListMessage } from 'src/utils/messages'
import type { Settings } from 'src/utils/settings'
import { updateLogLevel, log } from 'src/utils/logger'
import { setupActions } from './configuration'
import {getSessions} from './sessions'

const logContext = 'background/listeners'
const BADGE_BACKGROUND_COLOR = '#3b82f6'

const updateSession = async () => {
  log.debug(logContext, 'getWindows')

  const sessions = await getSessions(true)

  const message: UpdateSessionsListMessage = {
    type: MESSAGE_TYPE_UPDATE_SESSIONS_LIST,
    value: sessions,
  }
  await browser.runtime.sendMessage(message)
}

const setupWindowListeners = () => {
  log.debug(logContext, 'setupWindowListeners')

  browser.runtime.onMessage.addListener(
    (message: GetSessionsListMessage, _sender, sendResponse) => {
      if (message.type === MESSAGE_TYPE_GET_SESSIONS_LIST) {
        sendResponse(getSessions())
        return true
      }

      return false
    }
  )

  browser.windows.onCreated.addListener(updateSession)
  browser.windows.onRemoved.addListener(updateSession)
}

const updateTabCountBadge = async () => {
  try {
    log.debug(logContext, 'updateTabCountBadge')
    const tabs = await browser.tabs.query({})
    const count = tabs.length
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

const setupTabCountListeners = (showTabCountBadge: boolean) => {
  log.debug(logContext, 'setupTabCountListeners', showTabCountBadge)
  if (showTabCountBadge) {
    void updateTabCountDebounce()
    browser.tabs.onUpdated.addListener(updateTabCountDebounce)
    browser.tabs.onRemoved.addListener(updateTabCountDebounce)
    browser.tabs.onReplaced.addListener(updateTabCountDebounce)
    browser.tabs.onDetached.addListener(updateTabCountDebounce)
    browser.tabs.onAttached.addListener(updateTabCountDebounce)
    browser.tabs.onMoved.addListener(updateTabCountDebounce)
  } else {
    void clearTabCountBadge()
    browser.tabs.onUpdated.removeListener(updateTabCountDebounce)
    browser.tabs.onRemoved.removeListener(updateTabCountDebounce)
    browser.tabs.onReplaced.removeListener(updateTabCountDebounce)
    browser.tabs.onDetached.removeListener(updateTabCountDebounce)
    browser.tabs.onAttached.removeListener(updateTabCountDebounce)
    browser.tabs.onMoved.removeListener(updateTabCountDebounce)
  }
}

export const setupListeners = (settings: Settings) => {
  updateLogLevel(settings.debugMode)
  log.debug(logContext, 'setupListeners', settings)

  setupWindowListeners()
  setupTabCountListeners(settings.showTabCountBadge)

  browser.runtime.onMessage.addListener((message: ReloadActionsMessage) => {
    if (message.type === MESSAGE_TYPE_RELOAD_ACTIONS) {
      void setupActions(message.value)
    }

    return false
  })

  browser.runtime.onMessage.addListener(
    (message: ReloadTabListenersMessage) => {
      if (message.type === MESSAGE_TYPE_RELOAD_TAB_LISTENERS) {
        setupTabCountListeners(message.value)
      }

      return false
    }
  )

  browser.runtime.onMessage.addListener(
    (message: UpdateLogLevelMessage) => {
      if (message.type === MESSAGE_TYPE_UPDATE_LOG_LEVEL) {
        void updateLogLevel(message.value)
      }

      return false
    }
  )
}
