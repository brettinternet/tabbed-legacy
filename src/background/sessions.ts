import { v4 as uuidv4 } from 'uuid';

import { getAllWindows } from 'src/utils/browser/query'
import { saveCurrentSession, readCurrentSession, removeCurrentSession, savePreviousSession, readPreviousSessions } from 'src/utils/browser/storage'
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
  const session = await readCurrentSession()
  if (!session) {
    const newSession = createSession(windows)
    await saveCurrentSession(newSession)
    return newSession
  } else {
    session.windows = windows
    session.lastModifiedDate = new Date().toJSON()
    await saveCurrentSession(session)
    return session
  }
}

export const getSessions = async (): Promise<SessionLists> => {
  log.debug(logContext, 'getSessions()')

  return {
    current: await getCurrentSession(),
    previous: await readPreviousSessions(),
    saved: [],
  }
}

export const autoSaveSession = async (closedWindowId?: number) => {
  log.debug(logContext, 'autoSaveSession()', closedWindowId)

  const currentSession = await readCurrentSession() ?? await getCurrentSession()

  if (closedWindowId) {
    // if a window was closed
    const closedWindow = currentSession.windows.find(({ id }) => id === closedWindowId)

    if (closedWindow) {
      // if matching window from cached current session in `readCurrentSession`
      const validTabs = closedWindow?.tabs?.filter(tab => !isNewTab(tab))

      if (validTabs && validTabs.length === 0) {
        // if there are no meaningful tabs for autosave to store
        log.debug(logContext, 'autoSaveSession', 'note: ignoring closed window', closedWindow)
        return
      }

      const closedWindowSession = createSession([closedWindow])
      await savePreviousSession(closedWindowSession)
    } else {
      // otherwise save the entire session just in case
      await savePreviousSession(currentSession)
      await removeCurrentSession()
    }
  }
}
