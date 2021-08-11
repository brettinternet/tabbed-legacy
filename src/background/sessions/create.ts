import type { Session } from 'src/utils/browser/storage'
import type { SessionDataExport } from './export'
import { log } from 'src/utils/logger'
import {
  localStorageKeys,
  createSessionFromWindows,
  saveNewSession,
  saveImportedSession,
  LocalStorageKey,
} from 'src/utils/browser/storage'
import { isNewTab, getTabUrl } from 'src/utils/browser/query'
import { readSettings } from 'src/utils/browser/storage'
import { getSessionTitle, getWindowTitle } from './derived-title'
import { getCurrentSession, findWindow, findSession } from './query'
import { updateSessions } from './actions'
import { throwSessionId, throwWindowId } from '../errors'

const logContext = 'background/sessions/create'

export const filterWindowTabs = async (windows: browser.windows.Window[]) => {
  const matchingUrls = (url1: string, url2: string) => {
    try {
      return new URL(url1).href === new URL(url2).href
    } catch (_err) {
      return url1 === url2
    }
  }

  const { excludedUrls } = await readSettings()
  windows = windows.map(({ tabs, ...values }) => {
    if (tabs) {
      tabs = tabs.filter((tab) => {
        const url = getTabUrl(tab)
        if (url && !isNewTab(tab)) {
          return excludedUrls.parsed.every((excludedUrl) =>
            excludedUrl.includes('*')
              ? !excludedUrl
                  .split('*')
                  .every((segment) => url.includes(segment))
              : !matchingUrls(excludedUrl, url)
          )
        }
      })
    }
    return { ...values, tabs }
  })
  return windows
}

export const saveSession = async ({
  key = localStorageKeys.USER_SAVED_SESSIONS,
  session,
  ignoreEmpty = true,
  generateTitle = false,
}: {
  key?: LocalStorageKey
  session: Session
  ignoreEmpty?: boolean
  generateTitle?: boolean
}) => {
  log.debug(logContext, 'saveSession()', {
    key,
    session,
    ignoreEmpty,
    generateTitle,
  })

  session.windows = await filterWindowTabs(session.windows)
  if (ignoreEmpty && session.windows.every((win) => !win.tabs?.length)) {
    return
  }
  if (generateTitle && !session.title) {
    session.title = getSessionTitle(session.windows)
  }
  const newSession = await saveNewSession(key, session)
  return newSession.id
}

export const saveCurrentSession = async () => {
  const session = await getCurrentSession()
  await saveSession({ session })
  await updateSessions()
}

export const saveExistingSession = async ({
  sessionId,
  ignoreEmpty = true,
}: {
  sessionId: string
  ignoreEmpty?: boolean
}) => {
  log.debug(logContext, 'saveExistingSession()', { sessionId, ignoreEmpty })

  const session = await findSession(sessionId)
  if (session) {
    return saveSession({ session, ignoreEmpty })
  } else {
    throwSessionId(sessionId)
  }
}

export const saveWindow = async ({
  key = localStorageKeys.USER_SAVED_SESSIONS,
  win,
  ignoreEmpty = true,
  generateTitle = true,
}: {
  key?: LocalStorageKey
  win: browser.windows.Window
  ignoreEmpty?: boolean
  generateTitle?: boolean
}) => {
  log.debug(logContext, 'saveWindow()', {
    key,
    win,
    ignoreEmpty,
    generateTitle,
  })

  const filteredWindow = (await filterWindowTabs([win]))[0]
  if (ignoreEmpty && !filteredWindow.tabs?.length) {
    return
  }
  let title: string | undefined
  if (generateTitle && win.tabs) {
    title = getWindowTitle(win.tabs)
  }
  const session = await createSessionFromWindows(key, [filteredWindow], title)
  return session.id
}

export const saveWindowAsSession = async ({
  sessionId,
  windowId,
  ignoreEmpty = true,
}: {
  sessionId: string
  windowId: number
  ignoreEmpty?: boolean
}) => {
  log.debug(logContext, 'saveWindowAsSession()', {
    sessionId,
    windowId,
    ignoreEmpty,
  })

  const session = await findSession(sessionId)
  if (session) {
    const win = findWindow(windowId, session)
    if (win) {
      return saveWindow({ win, ignoreEmpty })
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
