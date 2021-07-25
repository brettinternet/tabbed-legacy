import { v4 as uuidv4 } from 'uuid'

import { getAllWindows } from 'src/utils/browser/query'
import {
  localStorageKeys,
  saveSession,
  readSession,
  removeSession,
  addSessionToCollection,
  readSessionCollection,
} from 'src/utils/browser/storage'
import type { SessionLists, Session } from 'src/utils/browser/storage'
import { log } from 'src/utils/logger'
import { isNewTab } from 'src/utils/browser/query'

const logContext = 'background/sessions'

const createSession = (windows: Session['windows']) => {
  log.debug(logContext, 'createSession()', windows)

  return {
    id: uuidv4(),
    lastModifiedDate: new Date().toJSON(),
    windows,
  }
}

const getCurrentSession = async (): Promise<Session> => {
  log.debug(logContext, 'getCurrentSession()')

  const windows = await getAllWindows({ populate: true }, true)
  const session = await readSession(localStorageKeys.CURRENT_SESSION)
  if (!session) {
    const newSession = createSession(windows)
    await saveSession(localStorageKeys.CURRENT_SESSION, newSession)
    return newSession
  } else {
    session.windows = windows
    session.lastModifiedDate = new Date().toJSON()
    await saveSession(localStorageKeys.CURRENT_SESSION, session)
    return session
  }
}

export const getSessions = async (): Promise<SessionLists> => {
  log.debug(logContext, 'getSessions()')

  return {
    current: await getCurrentSession(),
    previous: await readSessionCollection(localStorageKeys.PREVIOUS_SESSIONS),
    saved: [],
  }
}

/**
 * TODO: how to manage multiple closed windows on browser exit https://stackoverflow.com/a/3390760
 * In the meantime, we auto-save the current on startup in order to supplement on exit
 */
export const autoSaveSession = async (closedWindowId?: number) => {
  log.debug(logContext, 'autoSaveSession()', closedWindowId)

  let currentSession = await readSession(localStorageKeys.CURRENT_SESSION)

  if (closedWindowId !== undefined) {
    if (!currentSession) {
      currentSession = await getCurrentSession()
    }

    // if a window was closed
    const closedWindow = currentSession.windows.find(
      ({ id }) => id === closedWindowId
    )

    if (closedWindow) {
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

      const closedWindowSession = createSession([closedWindow])
      await addSessionToCollection(
        localStorageKeys.PREVIOUS_SESSIONS,
        closedWindowSession
      )
      return
    }
  }

  if (currentSession) {
    // otherwise save the entire session
    // TODO: possibly compare current session to be saved with most recent to determine if session is unique enough to be saved?
    await addSessionToCollection(
      localStorageKeys.PREVIOUS_SESSIONS,
      currentSession
    )
    await removeSession(localStorageKeys.CURRENT_SESSION)
  }
}
