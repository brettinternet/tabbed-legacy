import type { SessionDataExport } from './export'
import { log } from 'src/utils/logger'
import {
  localStorageKeys,
  createSessionFromWindows,
  saveNewSession,
  saveImportedSession,
} from 'src/utils/browser/storage'
import { getWindowTitle } from './derived-title'
import { getCurrentSession, findWindow, findSession } from './query'
import { updateSessions } from './actions'
import { throwSessionId, throwWindowId } from '../errors'

const logContext = 'background/sessions/create'

export const saveExistingSession = async (sessionId: string) => {
  log.debug(logContext, 'saveExistingSession()', sessionId)

  const session = await findSession(sessionId)
  if (session) {
    await saveNewSession(localStorageKeys.USER_SAVED_SESSIONS, session)
  } else {
    throwSessionId(sessionId)
  }
}

export const saveCurrentSession = async () => {
  const currentSession = await getCurrentSession()
  await saveExistingSession(currentSession.id)
  await updateSessions()
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
    if (win?.tabs) {
      const title = getWindowTitle(win.tabs)
      await createSessionFromWindows(
        localStorageKeys.USER_SAVED_SESSIONS,
        [win],
        title
      )
    } else {
      throwWindowId(windowId)
    }
  } else {
    throwSessionId(sessionId)
  }
}

export const importSessionsFromText = async (content?: string) => {
  if (content) {
    const data = JSON.parse(content) as SessionDataExport
    log.debug(logContext, 'importSessionsFromText()', 'parsed:', data)

    if (!data.sessions || !Array.isArray(data.sessions)) {
      throw Error('Unrecognized data format, sessions not found')
    }

    if (!data.sessions[0]?.id) {
      throw Error('No sessions found')
    }

    for (const session of data.sessions.reverse()) {
      await saveImportedSession(session)
    }
    await updateSessions()
  } else {
    throw Error('No content found in session import')
  }
}