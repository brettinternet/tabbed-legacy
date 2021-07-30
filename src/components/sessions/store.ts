import { writable, get } from 'svelte/store'

import { log } from 'src/utils/logger'
import { sortWindows } from 'src/utils/browser/query'
import type { SessionLists, Session } from 'src/utils/browser/storage'
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
  MESSAGE_TYPE_PATCH_WINDOW,
  MESSAGE_TYPE_PATCH_TAB,
  MESSAGE_TYPE_DISCARD_TABS,
  MESSAGE_TYPE_MOVE_TABS,
  MESSAGE_TYPE_DOWNLOAD_SESSIONS,
  MESSAGE_TYPE_FIND_DUPLICATE_SESSION_TABS,
  MESSAGE_TYPE_QUERY_SESSION,
} from 'src/utils/messages'
import type {
  GetSessionListsMessage,
  GetSessionListsResponse,
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
  RenameSessionMessage,
  PatchWindowOptions,
  PatchWindowMessage,
  PatchTabOptions,
  PatchTabMessage,
  DiscardTabsMessage,
  MoveTabsMessage,
  DownloadSessionsMessage,
  DownloadSessionsOptions,
  FindDuplicateSessionTabsMessage,
  FindDuplicateSessionTabsResponse,
  QuerySessionMessage,
  QuerySessionResponse,
  SessionQuery,
} from 'src/utils/messages'

const logContext = 'components/sessions/store'

export const currentWindowId = writable<number | undefined>()
export const currentTabId = writable<number | undefined>()
export const sessionLists = writable<SessionLists | undefined>()
export const selectedSessionId = writable<string | undefined>()
export const editSession = writable<Session | undefined>()

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

export const getSessionLists = async (): Promise<GetSessionListsResponse> => {
  log.debug(logContext, 'getSessionLists()')

  const message: GetSessionListsMessage = {
    type: MESSAGE_TYPE_GET_SESSION_LISTS,
  }
  return await browser.runtime.sendMessage(message)
}

export const forceUpdateSessions = async () => {
  sessionLists.set(await getSessionLists())
}

export const querySession = async (
  query: SessionQuery
): Promise<QuerySessionResponse> => {
  log.debug(logContext, 'querySession()', query)

  const message: QuerySessionMessage = {
    type: MESSAGE_TYPE_QUERY_SESSION,
    value: query,
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

export const patchWindow = async (
  sessionId: string,
  windowId: number,
  options: PatchWindowOptions
) => {
  const message: PatchWindowMessage = {
    type: MESSAGE_TYPE_PATCH_WINDOW,
    value: { sessionId, windowId, options },
  }
  await browser.runtime.sendMessage(message)
}

export const patchTab = async (
  sessionId: string,
  windowId: number,
  tabId: number,
  options: PatchTabOptions
) => {
  const message: PatchTabMessage = {
    type: MESSAGE_TYPE_PATCH_TAB,
    value: { sessionId, windowId, tabId, options },
  }
  await browser.runtime.sendMessage(message)
}

export const moveTabs = async (
  tabIds: number | number[],
  options: browser.tabs._MoveMoveProperties
) => {
  const message: MoveTabsMessage = {
    type: MESSAGE_TYPE_MOVE_TABS,
    value: { tabIds, options },
  }
  await browser.runtime.sendMessage(message)
}

export const discardTabs = async (tabIds: number | number[]) => {
  const message: DiscardTabsMessage = {
    type: MESSAGE_TYPE_DISCARD_TABS,
    value: { tabIds },
  }
  await browser.runtime.sendMessage(message)
}

export const downloadSessions = async (options: DownloadSessionsOptions) => {
  const message: DownloadSessionsMessage = {
    type: MESSAGE_TYPE_DOWNLOAD_SESSIONS,
    value: options,
  }
  await browser.runtime.sendMessage(message)
}

export const findDuplicateTabs = async (sessionId: string) => {
  const message: FindDuplicateSessionTabsMessage = {
    type: MESSAGE_TYPE_FIND_DUPLICATE_SESSION_TABS,
    value: { sessionId },
  }
  const dupes = (await browser.runtime.sendMessage(
    message
  )) as FindDuplicateSessionTabsResponse
  if (dupes.length > 0) {
    return dupes
  }
}
