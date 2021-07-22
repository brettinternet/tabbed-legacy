import { debounce } from 'lodash'

import {
  MESSAGE_TYPE_RELOAD_ACTIONS,
  MESSAGE_TYPE_RELOAD_TAB_LISTENERS,
  MESSAGE_TYPE_UPDATE_LOG_LEVEL,
  MESSAGE_TYPE_UPDATE_SESSIONS_LIST,
  MESSAGE_TYPE_GET_SESSIONS_LIST,
  MESSAGE_TYPE_RELOAD_CLOSED_WINDOW_LISTENER,
} from 'src/utils/messages'
import type {
  ReloadActionsMessage,
  ReloadTabListenersMessage,
  UpdateLogLevelMessage,
  UpdateSessionsListMessage,
  GetSessionsListMessage,
  ReloadClosedWindowListener,
} from 'src/utils/messages'
import type { Settings } from 'src/utils/settings'
import { updateLogLevel, log } from 'src/utils/logger'
import { setupActions } from './configuration'
import { getSessions, autoSaveSession } from './sessions'

const logContext = 'background/listeners'
const BADGE_BACKGROUND_COLOR = '#3b82f6'

const updateSessionMessage = async (
  sessions: UpdateSessionsListMessage['value']
) => {
  log.debug(logContext, 'updateSessionMessage()', sessions)

  const message: UpdateSessionsListMessage = {
    type: MESSAGE_TYPE_UPDATE_SESSIONS_LIST,
    value: sessions,
  }
  try {
    await browser.runtime.sendMessage(message)
  } catch (_err) {
    const err = browser.runtime.lastError
    if (
      err?.message !==
      'Could not establish connection. Receiving end does not exist.'
    ) {
      throw err
    }
  }
}

const handleClosedWindow = async (closedWindowId: number) => {
  log.debug(logContext, 'handleClosedWindow()', closedWindowId)

  try {
    await autoSaveSession(closedWindowId)
    const sessions = await getSessions()
    await updateSessionMessage(sessions)
  } catch (err) {
    log.error(logContext, 'handleClosedWindow', err)
  }
}

const updateSession = async () => {
  log.debug(logContext, 'getWindows')

  try {
    const sessions = await getSessions()
    await updateSessionMessage(sessions)
  } catch (err) {
    log.error(logContext, 'updateSession', err)
  }
}

const updateSessionDebounce = debounce(updateSession, 250)

const setupClosedWindowListener = (
  saveClosedWindows: Settings['saveClosedWindows']
) => {
  log.debug(logContext, 'setupClosedWindowListener()', saveClosedWindows)

  if (saveClosedWindows) {
    browser.windows.onRemoved.addListener(handleClosedWindow)
  } else {
    browser.windows.onRemoved.removeListener(handleClosedWindow)
  }
}

const setupWindowListeners = () => {
  log.debug(logContext, 'setupWindowListeners()')

  browser.runtime.onMessage.addListener((message: GetSessionsListMessage) => {
    if (message.type === MESSAGE_TYPE_GET_SESSIONS_LIST) {
      return new Promise((resolve) => {
        resolve(getSessions())
      })
    }

    return false
  })

  browser.windows.onCreated.addListener(updateSessionDebounce)
  browser.tabs.onUpdated.addListener(updateSessionDebounce)
}

const updateTabCountBadge = async () => {
  try {
    log.debug(logContext, 'updateTabCountBadge()')
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
  log.debug(logContext, 'setupTabCountListeners()', showTabCountBadge)
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
  log.debug(logContext, 'setupListeners()', settings)

  setupWindowListeners()
  setupClosedWindowListener(settings.saveClosedWindows)
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

  browser.runtime.onMessage.addListener((message: UpdateLogLevelMessage) => {
    if (message.type === MESSAGE_TYPE_UPDATE_LOG_LEVEL) {
      void updateLogLevel(message.value)
    }

    return false
  })

  browser.runtime.onMessage.addListener(
    (message: ReloadClosedWindowListener) => {
      if (message.type === MESSAGE_TYPE_RELOAD_CLOSED_WINDOW_LISTENER) {
        void setupClosedWindowListener(message.value)
      }

      return false
    }
  )
}
