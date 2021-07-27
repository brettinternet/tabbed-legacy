import { writable, get } from 'svelte/store'

import { log } from 'src/utils/logger'
import { sortWindows } from 'src/utils/browser/query'
import type { SessionLists } from 'src/utils/browser/storage'
import {
  MESSAGE_TYPE_GET_SESSIONS_LIST,
  MESSAGE_TYPE_SAVE_EXISTING_SESSION,
  MESSAGE_TYPE_SAVE_WINDOW,
  MESSAGE_TYPE_OPEN_SESSION,
  MESSAGE_TYPE_OPEN_SESSION_WINDOW,
  MESSAGE_TYPE_OPEN_SESSION_TAB,
  MESSAGE_TYPE_DELETE_SESSION,
  MESSAGE_TYPE_REMOVE_SESSION_WINDOW,
  MESSAGE_TYPE_REMOVE_SESSION_TAB,
  MESSAGE_TYPE_RENAME_SESSION,
  RenameSessionMessage,
} from 'src/utils/messages'
import type {
  GetSessionsListMessage,
  GetSessionsListResponse,
  SaveExistingSessionMessage,
  SaveWindowMessage,
  OpenSessionMessage,
  OpenSessionWindowMessage,
  OpenSessionTabMessage,
  DeleteSessionMessage,
  RemoveSessionWindowMessage,
  RemoveSessionTabMessage,
  OpenWindowOptions,
  OpenTabOptions,
} from 'src/utils/messages'

const logContext = 'components/sessions/store'

export const currentWindowId = writable<number | undefined>()
export const currentTabId = writable<number | undefined>()
export const sessionLists = writable<SessionLists | undefined>()
export const selectedSessionId = writable<string | undefined>()

export const sortCurrentSession = async (activeWindowId?: number) => {
  const session = get(sessionLists)
  if (session) {
    const windows = await sortWindows(session.current.windows, activeWindowId)
    sessionLists.update((state) =>
      state
        ? {
            ...state,
            current: {
              ...state.current,
              windows,
            },
          }
        : undefined
    )
  }
}

export const getSessions = async (): Promise<GetSessionsListResponse> => {
  log.debug(logContext, 'getSessions()')

  const message: GetSessionsListMessage = {
    type: MESSAGE_TYPE_GET_SESSIONS_LIST,
  }
  return await browser.runtime.sendMessage(message)
}

export const saveExistingSession = async (sessionId: string) => {
  const message: SaveExistingSessionMessage = {
    type: MESSAGE_TYPE_SAVE_EXISTING_SESSION,
    value: { sessionId },
  }
  await browser.runtime.sendMessage(message)
}

export const saveWindow = async (sessionId: string, windowId: number) => {
  const message: SaveWindowMessage = {
    type: MESSAGE_TYPE_SAVE_WINDOW,
    value: { sessionId, windowId },
  }
  await browser.runtime.sendMessage(message)
}

export const openSession = async (sessionId: string) => {
  const message: OpenSessionMessage = {
    type: MESSAGE_TYPE_OPEN_SESSION,
    value: { sessionId },
  }
  await browser.runtime.sendMessage(message)
}

export const openWindow = async (
  sessionId: string,
  windowId: number,
  options?: OpenWindowOptions
) => {
  const message: OpenSessionWindowMessage = {
    type: MESSAGE_TYPE_OPEN_SESSION_WINDOW,
    value: { sessionId, windowId, options },
  }
  await browser.runtime.sendMessage(message)
}

export const openTab = async (
  sessionId: string,
  windowId: number,
  tabId: number,
  options?: OpenTabOptions
) => {
  const message: OpenSessionTabMessage = {
    type: MESSAGE_TYPE_OPEN_SESSION_TAB,
    value: { sessionId, windowId, tabId, options },
  }
  await browser.runtime.sendMessage(message)
}

export const deleteSession = async (sessionId: string) => {
  const message: DeleteSessionMessage = {
    type: MESSAGE_TYPE_DELETE_SESSION,
    value: { sessionId },
  }
  await browser.runtime.sendMessage(message)
}

export const removeWindow = async (sessionId: string, windowId: number) => {
  const message: RemoveSessionWindowMessage = {
    type: MESSAGE_TYPE_REMOVE_SESSION_WINDOW,
    value: { sessionId, windowId },
  }
  await browser.runtime.sendMessage(message)
}

export const removeTab = async (
  sessionId: string,
  windowId: number,
  tabId: number
) => {
  const message: RemoveSessionTabMessage = {
    type: MESSAGE_TYPE_REMOVE_SESSION_TAB,
    value: { sessionId, windowId, tabId },
  }
  await browser.runtime.sendMessage(message)
}

export const renameSession = async (sessionId: string, name: string) => {
  const message: RenameSessionMessage = {
    type: MESSAGE_TYPE_RENAME_SESSION,
    value: { sessionId, name },
  }
  await browser.runtime.sendMessage(message)
}
