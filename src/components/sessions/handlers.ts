import { get } from 'svelte/store'

import type { EventHandler } from 'src/utils/svelte'
import type {
  OpenTabOptions,
  OpenWindowOptions,
  DownloadSessionsOptions,
} from 'src/utils/messages'
import { getActiveTabId } from 'src/utils/browser/query'
import { log } from 'src/utils/logger'
import {
  currentWindowId,
  currentTabId,
  sessionLists,
  selectedSessionId,
  editSession,
  sortCurrentSession,
  duplicates,
} from 'src/components/sessions/store'
import {
  getSessionLists,
  saveExistingSession,
  saveWindow,
  openSession,
  openWindow,
  openTab,
  deleteSession,
  removeWindow,
  removeTab,
  renameSession,
  patchWindow,
  patchTab,
  downloadSessions,
  findDuplicateTabs,
} from 'src/components/sessions/send'
import { modal } from 'src/components/modal/store'
import { toast } from 'src/components/toast/store'

const logContext = 'components/sessions/handlers'

const handleError = (error: unknown) => {
  log.error(error)
  const { message } = error as browser.runtime._LastError
  if (message) {
    toast.push({ message, level: 'error' })
  }
}

export const handleHighlightDuplicateTabUrls = async (sessionId?: string) => {
  try {
    if (sessionId) {
      const urls = await findDuplicateTabs(sessionId)
      if (urls) {
        duplicates.set({ urls, sessionId })
        return
      }
    }
    duplicates.set(undefined)
  } catch (err) {
    handleError(err)
  }
}

export const updateSessions = async () => {
  try {
    sessionLists.set(await getSessionLists())
    const _duplicates = get(duplicates)
    if (_duplicates) {
      await handleHighlightDuplicateTabUrls(_duplicates.sessionId)
    }
  } catch (err) {
    handleError(err)
  }
}

export const openSessionEditor = () => {
  modal.sessionEdit.set(true)
}

export const closeSessionEditor = () => {
  modal.sessionEdit.set(false)
  editSession.set(undefined)
}

export const handleOpenSession = async (sessionId: string) => {
  log.debug(logContext, 'handleOpenSession()', sessionId)

  try {
    await openSession(sessionId)
    selectedSessionId.set(sessionId)
  } catch (err) {
    handleError(err)
  }

  await updateSessions()
}

export const handleSaveSession = async (sessionId: string) => {
  log.debug(logContext, 'handleSaveSession()', sessionId)

  try {
    await saveExistingSession(sessionId)
    selectedSessionId.set(sessionId)
  } catch (err) {
    handleError(err)
  }

  await updateSessions()
}

export const handleDeleteSession = async (sessionId: string) => {
  log.debug(logContext, 'handleDeleteSession()', sessionId)

  try {
    await deleteSession(sessionId)
  } catch (err) {
    handleError(err)
  }

  await updateSessions()
  selectedSessionId.update((current) =>
    current === sessionId ? undefined : current
  )
}

export const handleRenameSession = async (sessionId: string, name: string) => {
  log.debug(logContext, 'handleRenameSession()', sessionId)

  try {
    // TODO: name validation here
    await renameSession(sessionId, name)
  } catch (err) {
    handleError(err)
  }

  await updateSessions()
}

export const handleOpenWindow = async (
  sessionId: string,
  windowId: number,
  options?: OpenWindowOptions
) => {
  log.debug(logContext, 'handleOpenWindow()', sessionId, windowId)

  try {
    await openWindow(sessionId, windowId, options)
  } catch (err) {
    handleError(err)
  }

  await updateSessions()
  selectedSessionId.set(sessionId)
}

export const handleSaveWindow = async (sessionId: string, windowId: number) => {
  log.debug(logContext, 'handleSaveWindow()', sessionId)

  try {
    await saveWindow(sessionId, windowId)
  } catch (err) {
    handleError(err)
  }

  await updateSessions()
  selectedSessionId.set(sessionId)
}

export const handleRemoveWindow = async (
  sessionId: string,
  windowId: number
) => {
  log.debug(logContext, 'handleRemoveWindow()', sessionId)

  try {
    await removeWindow(sessionId, windowId)
  } catch (err) {
    handleError(err)
  }

  await updateSessions()
}

export const handleOpenTab = async (
  sessionId: string,
  windowId: number,
  tabId: number,
  options?: OpenTabOptions
) => {
  try {
    await openTab(sessionId, windowId, tabId, options)
  } catch (err) {
    handleError(err)
  }

  await updateSessions()
}

export const handleCloseTab = async (
  sessionId: string,
  windowId: number,
  tabId: number
) => {
  try {
    await removeTab(sessionId, windowId, tabId)
  } catch (err) {
    handleError(err)
  }

  await updateSessions()
}

export const handleMinimizeWindow = async (
  sessionId: string,
  windowId: number,
  minimized: boolean
) => {
  try {
    await patchWindow(sessionId, windowId, {
      state: minimized ? 'minimized' : 'normal',
    })
  } catch (err) {
    handleError(err)
  }

  await updateSessions()
}

export const handlePinTab = async (
  sessionId: string,
  windowId: number,
  tabId: number,
  pinned: boolean
) => {
  try {
    await patchTab(sessionId, windowId, tabId, { pinned })
  } catch (err) {
    handleError(err)
  }

  await updateSessions()
}

export const handleDownloadSessions = async (
  options: DownloadSessionsOptions
) => {
  try {
    await downloadSessions(options)
  } catch (err) {
    handleError(err)
  }
}

export const handleToggleSession: EventHandler<MouseEvent, HTMLButtonElement> =
  (ev) => {
    const nextId = ev.currentTarget.dataset.sessionId
    selectedSessionId.update((current) =>
      current === nextId ? undefined : nextId
    )
  }

export const handleSelectSession: EventHandler<MouseEvent, HTMLButtonElement> =
  (ev) => {
    const nextId = ev.currentTarget.dataset.sessionId
    selectedSessionId.set(nextId)
  }

export const handleActiveTabChange = (
  info: browser.tabs._OnActivatedActiveInfo
) => {
  currentWindowId.set(info.windowId)
  currentTabId.set(info.tabId)
}

export const handleFocusWindowChange = async (activeWindowId: number) => {
  if (activeWindowId > 0) {
    const tabId = await getActiveTabId(activeWindowId)
    currentWindowId.set(activeWindowId)
    currentTabId.set(tabId)
    await sortCurrentSession(activeWindowId)
  } else {
    currentWindowId.set(undefined)
    currentTabId.set(undefined)
  }
}
