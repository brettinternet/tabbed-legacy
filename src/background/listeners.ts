import { debounce } from 'lodash'

import { isProd } from 'src/utils/env'
import {
  MESSAGE_TYPE_RELOAD_ACTIONS,
  MESSAGE_TYPE_RELOAD_TAB_LISTENERS,
  MESSAGE_TYPE_UPDATE_LOG_LEVEL,
  MESSAGE_TYPE_UPDATE_SESSIONS_LIST,
  MESSAGE_TYPE_GET_SESSIONS_LIST,
  MESSAGE_TYPE_RELOAD_CLOSED_WINDOW_LISTENER,
  MESSAGE_TYPE_SAVE_EXISTING_SESSION,
  MESSAGE_TYPE_SAVE_WINDOW,
  MESSAGE_TYPE_OPEN_SESSION,
  MESSAGE_TYPE_OPEN_SESSION_WINDOW,
  MESSAGE_TYPE_OPEN_SESSION_TAB,
  MESSAGE_TYPE_DELETE_SESSION,
  MESSAGE_TYPE_REMOVE_SESSION_WINDOW,
  MESSAGE_TYPE_REMOVE_SESSION_TAB,
  MESSAGE_TYPE_RENAME_SESSION,
  MESSAGE_TYPE_PATCH_TAB,
  MESSAGE_TYPE_PATCH_WINDOW,
  DiscardTabsMessage,
  MESSAGE_TYPE_DISCARD_TABS,
} from 'src/utils/messages'
import type {
  ReloadActionsMessage,
  ReloadTabListenersMessage,
  UpdateLogLevelMessage,
  UpdateSessionsListMessage,
  GetSessionsListMessage,
  ReloadClosedWindowListenerMessage,
  SaveExistingSessionMessage,
  SaveWindowMessage,
  OpenSessionMessage,
  OpenSessionWindowMessage,
  OpenSessionTabMessage,
  DeleteSessionMessage,
  RemoveSessionWindowMessage,
  RemoveSessionTabMessage,
  RenameSessionMessage,
  PatchWindowMessage,
  PatchTabMessage,
} from 'src/utils/messages'
import type { Settings } from 'src/utils/settings'
import { updateLogLevel, log } from 'src/utils/logger'
import { loadActions } from './configuration'
import {
  getSessionLists,
  autoSaveSession,
  saveExistingSession,
  saveWindowAsSession,
  openSession,
  openSessionWindow,
  openSessionTab,
  deleteSession,
  removeWindow,
  removeTab,
  renameSession,
  patchWindow,
  patchTab,
  discardTabs,
} from './sessions'

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
    // If client is not merely closed
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
    const sessions = await getSessionLists()
    await updateSessionMessage(sessions)
  } catch (err) {
    log.error(logContext, 'handleClosedWindow', err)
  }
}

const updateSession = async () => {
  log.debug(logContext, 'getWindows')

  try {
    const sessions = await getSessionLists()
    await updateSessionMessage(sessions)
  } catch (err) {
    log.error(logContext, 'updateSession', err)
  }
}

const updateSessionDebounce = debounce(updateSession, 250)

const loadClosedWindowListener = (
  saveClosedWindows: Settings['saveClosedWindows']
) => {
  log.debug(logContext, 'loadClosedWindowListener()', saveClosedWindows)

  if (saveClosedWindows) {
    browser.windows.onRemoved.addListener(handleClosedWindow)
  } else {
    browser.windows.onRemoved.removeListener(handleClosedWindow)
    browser.windows.onRemoved.addListener(updateSessionDebounce)
  }
}

const setupSessionListeners = () => {
  log.debug(logContext, 'setupSessionListeners()')

  // Don't auto save unless prod, else live reload clutters the previous sessions
  if (isProd) {
    void autoSaveSession()
  }

  browser.runtime.onMessage.addListener((message: GetSessionsListMessage) => {
    if (message.type === MESSAGE_TYPE_GET_SESSIONS_LIST) {
      return getSessionLists()
    }

    return false
  })

  browser.runtime.onMessage.addListener(
    (message: SaveExistingSessionMessage) => {
      if (message.type === MESSAGE_TYPE_SAVE_EXISTING_SESSION) {
        return saveExistingSession(message.value.sessionId)
      }

      return false
    }
  )

  browser.runtime.onMessage.addListener((message: SaveWindowMessage) => {
    if (message.type === MESSAGE_TYPE_SAVE_WINDOW) {
      return saveWindowAsSession(message.value)
    }

    return false
  })

  browser.runtime.onMessage.addListener((message: RenameSessionMessage) => {
    if (message.type === MESSAGE_TYPE_RENAME_SESSION) {
      return renameSession(message.value)
    }

    return false
  })

  browser.runtime.onMessage.addListener((message: OpenSessionMessage) => {
    if (message.type === MESSAGE_TYPE_OPEN_SESSION) {
      return openSession(message.value.sessionId)
    }

    return false
  })

  browser.runtime.onMessage.addListener((message: OpenSessionWindowMessage) => {
    if (message.type === MESSAGE_TYPE_OPEN_SESSION_WINDOW) {
      return openSessionWindow(message.value)
    }

    return false
  })

  browser.runtime.onMessage.addListener((message: OpenSessionTabMessage) => {
    if (message.type === MESSAGE_TYPE_OPEN_SESSION_TAB) {
      return openSessionTab(message.value)
    }

    return false
  })

  browser.runtime.onMessage.addListener((message: DeleteSessionMessage) => {
    if (message.type === MESSAGE_TYPE_DELETE_SESSION) {
      return deleteSession(message.value.sessionId)
    }

    return false
  })

  browser.runtime.onMessage.addListener(
    (message: RemoveSessionWindowMessage) => {
      if (message.type === MESSAGE_TYPE_REMOVE_SESSION_WINDOW) {
        return removeWindow(message.value)
      }

      return false
    }
  )

  browser.runtime.onMessage.addListener((message: RemoveSessionTabMessage) => {
    if (message.type === MESSAGE_TYPE_REMOVE_SESSION_TAB) {
      return removeTab(message.value)
    }

    return false
  })

  browser.runtime.onMessage.addListener((message: PatchWindowMessage) => {
    if (message.type === MESSAGE_TYPE_PATCH_WINDOW) {
      return patchWindow(message.value)
    }

    return false
  })

  browser.runtime.onMessage.addListener((message: PatchTabMessage) => {
    if (message.type === MESSAGE_TYPE_PATCH_TAB) {
      return patchTab(message.value)
    }

    return false
  })

  browser.runtime.onMessage.addListener((message: DiscardTabsMessage) => {
    if (message.type === MESSAGE_TYPE_DISCARD_TABS) {
      return discardTabs(message.value.tabIds)
    }

    return false
  })

  browser.windows.onCreated.addListener(updateSessionDebounce)
  browser.tabs.onUpdated.addListener(updateSessionDebounce)
  browser.tabs.onDetached.addListener(updateSessionDebounce)
  browser.tabs.onRemoved.addListener(updateSessionDebounce)
  browser.tabs.onMoved.addListener(updateSessionDebounce)
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

const loadTabCountListeners = (showTabCountBadge: boolean) => {
  log.debug(logContext, 'loadTabCountListeners()', showTabCountBadge)

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

  setupSessionListeners()
  loadClosedWindowListener(settings.saveClosedWindows)
  loadTabCountListeners(settings.showTabCountBadge)

  browser.runtime.onMessage.addListener((message: ReloadActionsMessage) => {
    if (message.type === MESSAGE_TYPE_RELOAD_ACTIONS) {
      void loadActions(message.value)
    }

    return false
  })

  browser.runtime.onMessage.addListener(
    (message: ReloadTabListenersMessage) => {
      if (message.type === MESSAGE_TYPE_RELOAD_TAB_LISTENERS) {
        loadTabCountListeners(message.value)
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
    (message: ReloadClosedWindowListenerMessage) => {
      if (message.type === MESSAGE_TYPE_RELOAD_CLOSED_WINDOW_LISTENER) {
        void loadClosedWindowListener(message.value)
      }

      return false
    }
  )
}
