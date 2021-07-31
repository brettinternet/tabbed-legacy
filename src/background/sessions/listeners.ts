import type { Settings } from 'src/utils/settings'
import { log } from 'src/utils/logger'
import { isProd } from 'src/utils/env'
import {
  MESSAGE_TYPE_GET_SESSION_LISTS,
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
  MESSAGE_TYPE_DISCARD_TABS,
  MESSAGE_TYPE_MOVE_TABS,
  MESSAGE_TYPE_DOWNLOAD_SESSIONS,
  MESSAGE_TYPE_FIND_DUPLICATE_SESSION_TABS,
  MESSAGE_TYPE_IMPORT_SESSIONS_FROM_TEXT,
  MESSAGE_TYPE_GET_ALL_SESSIONS,
  MESSAGE_TYPE_QUERY_SESSION,
} from 'src/utils/messages'
import type {
  GetSessionListsMessage,
  QuerySessionMessage,
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
  DiscardTabsMessage,
  MoveTabsMessage,
  DownloadSessionsMessage,
  FindDuplicateSessionTabsMessage,
  ImportSessionsFromTextMessage,
  GetAllSessionsMessage,
} from 'src/utils/messages'
import {
  getSessionLists,
  getAllSessions,
  findDuplicateSessionTabs,
  querySession,
} from './query'
import {
  saveExistingSession,
  saveWindowAsSession,
  importSessionsFromText,
} from './create'
import { deleteSession, removeWindow, removeTab } from './delete'
import {
  renameSession,
  patchWindow,
  patchTab,
  discardTabs,
  moveTabs,
} from './put'
import { downloadSessions } from './export'
import { autoSaveSession, handleClosedWindow } from './autosave'
import {
  updateSessionsDebounce,
  openSession,
  openSessionWindow,
  openSessionTab,
} from './actions'

const logContext = 'background/sessions/listeners'

export const loadClosedWindowListener = (
  saveClosedWindows: Settings['saveClosedWindows']
) => {
  log.debug(logContext, 'loadClosedWindowListener()', saveClosedWindows)

  if (saveClosedWindows) {
    browser.windows.onRemoved.addListener(handleClosedWindow)
  } else {
    browser.windows.onRemoved.removeListener(handleClosedWindow)
    browser.windows.onRemoved.addListener(updateSessionsDebounce)
  }
}

export const setupSessionListeners = () => {
  log.debug(logContext, 'setupSessionListeners()')

  // Don't auto save unless prod, else live reload clutters the previous sessions
  if (isProd) {
    void autoSaveSession()
  }

  browser.runtime.onMessage.addListener((message: GetSessionListsMessage) => {
    if (message.type === MESSAGE_TYPE_GET_SESSION_LISTS) {
      return getSessionLists()
    }

    return false
  })

  browser.runtime.onMessage.addListener((message: GetAllSessionsMessage) => {
    if (message.type === MESSAGE_TYPE_GET_ALL_SESSIONS) {
      return getAllSessions()
    }

    return false
  })

  browser.runtime.onMessage.addListener((message: QuerySessionMessage) => {
    if (message.type === MESSAGE_TYPE_QUERY_SESSION) {
      return querySession(message.value)
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

  browser.runtime.onMessage.addListener((message: MoveTabsMessage) => {
    if (message.type === MESSAGE_TYPE_MOVE_TABS) {
      return moveTabs(message.value)
    }

    return false
  })

  browser.runtime.onMessage.addListener((message: DownloadSessionsMessage) => {
    if (message.type === MESSAGE_TYPE_DOWNLOAD_SESSIONS) {
      return downloadSessions(message.value)
    }

    return false
  })

  browser.runtime.onMessage.addListener(
    (message: FindDuplicateSessionTabsMessage) => {
      if (message.type === MESSAGE_TYPE_FIND_DUPLICATE_SESSION_TABS) {
        return findDuplicateSessionTabs(message.value.sessionId)
      }

      return false
    }
  )

  browser.runtime.onMessage.addListener(
    (message: ImportSessionsFromTextMessage) => {
      if (message.type === MESSAGE_TYPE_IMPORT_SESSIONS_FROM_TEXT) {
        return importSessionsFromText(message.value.content)
      }

      return false
    }
  )

  browser.windows.onCreated.addListener(updateSessionsDebounce)
  browser.tabs.onUpdated.addListener(updateSessionsDebounce)
  browser.tabs.onDetached.addListener(updateSessionsDebounce)
  browser.tabs.onRemoved.addListener(updateSessionsDebounce)
  browser.tabs.onMoved.addListener(updateSessionsDebounce)
}
