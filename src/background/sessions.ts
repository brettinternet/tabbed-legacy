import { lightFormat } from 'date-fns'

import {
  closeTab,
  closeWindow,
  focusWindow,
  focusWindowTab,
  getAllWindows,
  getTabUrl,
  isNewTab,
  openTab,
  openWindow,
  openWindows,
} from 'src/utils/browser/query'
import {
  localStorageKeys,
  createSessionFromWindows,
  saveNewSession,
  patchSession,
  readSession,
  removeSession,
  readSessionCollection,
  patchSessionInCollection,
  deleteSessionInCollection,
  readSettings,
} from 'src/utils/browser/storage'
import type {
  PatchWindowOptions,
  PatchTabOptions,
  DownloadSessionsOptions,
  OpenWindowOptions,
  OpenTabOptions,
} from 'src/utils/messages'
import { isDefined } from 'src/utils/helpers'
import type { SessionLists, Session } from 'src/utils/browser/storage'
import { log } from 'src/utils/logger'
import { appName } from 'src/utils/env'

const logContext = 'background/sessions'

const getCurrentSession = async (): Promise<Session> => {
  log.debug(logContext, 'getCurrentSession()')

  const session = await readSession(localStorageKeys.CURRENT_SESSION)
  const windows = await getAllWindows({ populate: true }, true)
  if (!session) {
    const newSession = await createSessionFromWindows(
      localStorageKeys.CURRENT_SESSION,
      windows
    )
    return newSession
  } else {
    session.windows = windows
    await patchSession(localStorageKeys.CURRENT_SESSION, session)
    return session
  }
}

export const getSessionLists = async (): Promise<SessionLists> => {
  log.debug(logContext, 'getSessionCategories()')

  return {
    current: await getCurrentSession(),
    previous: await readSessionCollection(localStorageKeys.PREVIOUS_SESSIONS),
    saved: await readSessionCollection(localStorageKeys.USER_SAVED_SESSIONS),
  }
}

const getSessions = async (): Promise<Session[]> => {
  const sessionLists = await getSessionLists()
  return [sessionLists.current, ...sessionLists.previous, ...sessionLists.saved]
}

/**
 * TODO: how to manage multiple closed windows on browser exit https://stackoverflow.com/a/3390760
 * In the meantime, we auto-save the current on startup in order to supplement on exit
 */
export const autoSaveSession = async (closedWindowId?: number) => {
  log.debug(logContext, 'autoSaveSession()', closedWindowId)

  const settings = await readSettings()
  let currentSession = await readSession(localStorageKeys.CURRENT_SESSION)

  if (closedWindowId !== undefined) {
    if (!currentSession) {
      currentSession = await getCurrentSession()
    }

    // if a window was closed
    const closedWindow = currentSession.windows.find(
      ({ id }) => id === closedWindowId
    )

    if (closedWindow && !(!settings.saveIncognito && closedWindow.incognito)) {
      // if matching window from cached current session in `readSession`
      const tabIds = (await browser.tabs.query({}))?.map(({ id }) => id)

      // filter by newtab or if tab exists elsewhere now then it was only moved
      const tabsToSave = closedWindow?.tabs?.filter(
        (tab) => !isNewTab(tab) && !tabIds.includes(tab.id)
      )

      if (tabsToSave && tabsToSave.length === 0) {
        // if there are no meaningful tabs for autosave to store
        log.debug(
          logContext,
          'autoSaveSession',
          'note: ignoring closed window',
          closedWindow
        )
        return
      }

      await createSessionFromWindows(localStorageKeys.PREVIOUS_SESSIONS, [
        closedWindow,
      ])
      return
    }
  }

  if (currentSession) {
    if (!settings.saveIncognito) {
      currentSession.windows = currentSession.windows.filter(
        (w) => !w.incognito
      )
    }
    // otherwise save the entire session
    // TODO: possibly compare current session to be saved with most recent to determine if session is unique enough to be saved?
    // TODO: consolidate with browser.sessions.getRecentlyClosed() https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/sessions/getRecentlyClosed
    await saveNewSession(localStorageKeys.PREVIOUS_SESSIONS, currentSession)
    await removeSession(localStorageKeys.CURRENT_SESSION)
  }
}

const findSession = async (sessionId: Session['id']) => {
  const sessions = await getSessions()
  return sessions.find((s) => s.id === sessionId)
}

const findWindow = (windowId: number, session: Session) =>
  session.windows.find((w) => w.id === windowId)

const throwSessionId = (sessionId: string) => {
  throw Error(`Unable to find session by ID ${sessionId}`)
}

const throwWindowId = (windowId: number) => {
  throw Error(`Unable to find window by ID ${windowId}`)
}

const throwTabId = (tabId: number) => {
  throw Error(`Unable to find tab by ID ${tabId}`)
}

export const saveExistingSession = async (sessionId: string) => {
  log.debug(logContext, 'saveExistingSession()', sessionId)

  const session = await findSession(sessionId)
  if (session) {
    await saveNewSession(localStorageKeys.USER_SAVED_SESSIONS, session)
  } else {
    throwSessionId(sessionId)
  }
}

export const saveWindowAsSession = async ({
  sessionId,
  windowId,
}: {
  sessionId: string
  windowId: number
}) => {
  log.debug(logContext, 'saveWindowAsSession()', { sessionId, windowId })

  const session = await findSession(sessionId)
  if (session) {
    const win = findWindow(windowId, session)
    if (win) {
      await createSessionFromWindows(localStorageKeys.USER_SAVED_SESSIONS, [
        win,
      ])
    } else {
      throwWindowId(windowId)
    }
  } else {
    throwSessionId(sessionId)
  }
}

export const openSession = async (sessionId: string) => {
  log.debug(logContext, 'openSession()', sessionId)

  const session = await findSession(sessionId)
  if (session) {
    await openWindows(session.windows)
  } else {
    throwSessionId(sessionId)
  }
}

const findSessionWithKey = async (sessionId: string) => {
  const sessionLists = await getSessionLists()
  if (sessionId === sessionLists.current.id) {
    return {
      key: localStorageKeys.CURRENT_SESSION,
      session: sessionLists.current,
    }
  }
  const previous = sessionLists.previous.find(({ id }) => id === sessionId)
  if (previous) {
    return {
      key: localStorageKeys.PREVIOUS_SESSIONS,
      session: previous,
    }
  }
  const saved = sessionLists.saved.find(({ id }) => id === sessionId)
  if (saved) {
    return {
      key: localStorageKeys.USER_SAVED_SESSIONS,
      session: saved,
    }
  }

  return {}
}

/**
 * If available, focus the window; Otherwise, open the window anew
 */
export const openSessionWindow = async ({
  sessionId,
  windowId,
  options,
}: {
  sessionId: string
  windowId: number
  options?: OpenWindowOptions
}) => {
  log.debug(logContext, 'openSessionWindow()', { sessionId, windowId, options })

  const currentSession = await getCurrentSession()
  if (!options?.noFocus && sessionId === currentSession?.id) {
    await focusWindow(windowId)
  } else {
    const session = await findSession(sessionId)
    if (session) {
      const win = findWindow(windowId, session)
      if (win) {
        await openWindow(win)
      } else {
        throwWindowId(windowId)
      }
    } else {
      throwSessionId(sessionId)
    }
  }
}

export const openSessionTab = async ({
  sessionId,
  windowId,
  tabId,
  options,
}: {
  sessionId: string
  windowId: number
  tabId: number
  options?: OpenTabOptions
}) => {
  log.debug(logContext, 'openSessionTab()', {
    sessionId,
    windowId,
    tabId,
    options,
  })

  const { key, session } = await findSessionWithKey(sessionId)

  if (key && session) {
    if (!options?.noFocus && key === localStorageKeys.CURRENT_SESSION) {
      await focusWindowTab(windowId, tabId)
    } else {
      const win = findWindow(windowId, session)
      if (win) {
        const tab = win.tabs?.find((t) => t.id === tabId)
        if (tab) {
          const url = getTabUrl(tab)
          if (url) {
            await openTab(
              {
                url,
                pinned: tab.pinned,
              },
              win.incognito
            )
          } else {
            throw Error(`No tab url found for tab ID ${tabId}`)
          }
        } else {
          throwTabId(tabId)
        }
      } else {
        throwWindowId(windowId)
      }
    }
  } else {
    throwSessionId(sessionId)
  }
}

export const deleteSession = async (sessionId: string) => {
  log.debug(logContext, 'deleteSession()', sessionId)

  const { key, session } = await findSessionWithKey(sessionId)
  if (key && session) {
    await deleteSessionInCollection(key, session.id)
  } else {
    throwSessionId(sessionId)
  }
}

export const removeWindow = async ({
  sessionId,
  windowId,
}: {
  sessionId: string
  windowId: number
}) => {
  log.debug(logContext, 'removeWindow()', { sessionId, windowId })

  const { key, session } = await findSessionWithKey(sessionId)

  if (key && session) {
    if (key === localStorageKeys.CURRENT_SESSION) {
      await closeWindow(windowId)
    } else {
      const windowIndex = session.windows.findIndex(({ id }) => id === windowId)
      if (windowIndex > -1) {
        session.windows.splice(windowIndex, 1)
        await patchSessionInCollection(key, session)
      } else {
        throwWindowId(windowId)
      }
    }
  } else {
    throwSessionId(sessionId)
  }
}

export const removeTab = async ({
  sessionId,
  windowId,
  tabId,
}: {
  sessionId: string
  windowId: number
  tabId: number
}) => {
  log.debug(logContext, 'removeTab()', { sessionId, windowId, tabId })

  const { key, session } = await findSessionWithKey(sessionId)

  if (key && session) {
    if (key === localStorageKeys.CURRENT_SESSION) {
      await closeTab(tabId)
    } else {
      const windowIndex = session.windows.findIndex((w) => w.id === windowId)
      if (windowIndex > -1) {
        const tabIndex = session.windows[windowIndex].tabs?.findIndex(
          (t) => t.id === tabId
        )
        if (isDefined(tabIndex) && tabIndex > -1) {
          session.windows[windowIndex].tabs?.splice(tabIndex, 1)
          await patchSessionInCollection(key, session)
        } else {
          throwTabId(tabId)
        }
      } else {
        throwWindowId(windowId)
      }
    }
  } else {
    throwSessionId(sessionId)
  }
}

export const renameSession = async ({
  sessionId,
  name,
}: {
  sessionId: string
  name: string
}) => {
  log.debug(logContext, 'renameSession()', { sessionId, name })

  const { key, session } = await findSessionWithKey(sessionId)
  if (key && session) {
    session.title = name
    await patchSession(key, session)
  } else {
    throwSessionId(sessionId)
  }
}

export const patchWindow = async ({
  sessionId,
  windowId,
  options,
}: {
  sessionId: string
  windowId: number
  options: PatchWindowOptions
}) => {
  log.debug(logContext, 'patchWindow()', { sessionId, windowId, options })

  const { key, session } = await findSessionWithKey(sessionId)

  if (key && session) {
    if (key === localStorageKeys.CURRENT_SESSION) {
      await browser.windows.update(windowId, options)
    } else {
      const windowIndex = session.windows.findIndex((w) => w.id === windowId)
      if (windowIndex > -1) {
        const newWindow: browser.windows.Window = {
          ...session.windows[windowIndex],
          ...options,
        }
        session.windows.splice(windowIndex, 1, newWindow)
        await patchSessionInCollection(key, session)
      } else {
        throwWindowId(windowId)
      }
    }
  } else {
    throwSessionId(sessionId)
  }
}

export const patchTab = async ({
  sessionId,
  windowId,
  tabId,
  options,
}: {
  sessionId: string
  windowId: number
  tabId: number
  options: PatchTabOptions
}) => {
  log.debug(logContext, 'patchTab()', { sessionId, windowId, options })

  const { key, session } = await findSessionWithKey(sessionId)

  if (key && session) {
    if (key === localStorageKeys.CURRENT_SESSION) {
      await browser.tabs.update(windowId, options)
    } else {
      const windowIndex = session.windows.findIndex((w) => w.id === windowId)
      if (windowIndex > -1) {
        const tabIndex = session.windows[windowIndex].tabs?.findIndex(
          (t) => t.id === tabId
        )
        const tabs = session.windows[windowIndex].tabs
        if (isDefined(tabIndex) && tabIndex > -1 && tabs?.[tabIndex]) {
          const newTabFields: Partial<browser.tabs.Tab> = options
          const updatedTab = Object.assign(
            {},
            session.windows[windowIndex].tabs?.[tabIndex],
            newTabFields
          )
          session.windows[windowIndex].tabs?.splice(tabIndex, 1, updatedTab)
          await patchSessionInCollection(key, session)
        } else {
          throwTabId(tabId)
        }
      } else {
        throwWindowId(windowId)
      }
    }
  } else {
    throwSessionId(sessionId)
  }
}

export const discardTabs = async (tabIds: number | number[]) => {
  log.debug(logContext, 'discardTabs()', tabIds)

  await browser.tabs.discard(tabIds)
}

export const moveTabs = async ({
  tabIds,
  options,
}: {
  tabIds: number | number[]
  options: browser.tabs._MoveMoveProperties
}) => {
  log.debug(logContext, 'moveTab()', { tabIds, options })

  await browser.tabs.move(tabIds, options)
}

export const downloadSessions = async ({
  sessionIds,
}: DownloadSessionsOptions) => {
  log.debug(logContext, 'downloadSession()', { sessionIds })

  let data: unknown
  let title = appName
  if (isDefined(sessionIds) && !Array.isArray(sessionIds)) {
    const sessionId = sessionIds
    const session = await findSession(sessionId)
    if (session) {
      data = [session]
      if (session.title) {
        title = appName
      }
    } else {
      throwSessionId(sessionId)
    }
  } else {
    let sessions = await getSessions()
    if (sessionIds) {
      sessions = sessions.filter((s) => sessionIds.includes(s.id))
    }
    data = sessions
  }

  if (data) {
    const downloadUrl = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, '    ')], {
        type: 'application/json',
      })
    )

    const timestamp = lightFormat(new Date(), 'yyyy-MM-dd-hh-mm-ss-SS')
    await browser.downloads.download({
      url: downloadUrl,
      filename: `${title}_${timestamp}.json`,
      conflictAction: 'uniquify',
      saveAs: false,
    })
  } else {
    throw Error('Unable to read sessions')
  }
}
