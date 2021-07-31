import { log } from 'src/utils/logger'
import { isNewTab } from 'src/utils/browser/query'
import {
  localStorageKeys,
  createSessionFromWindows,
  saveNewSession,
  readSession,
  removeSession,
  readSettings,
} from 'src/utils/browser/storage'
import { getSessionTitle, getWindowTitle } from './derived-title'
import { updateSessionsDebounce } from './actions'
import { getCurrentSession } from './query'

const logContext = 'background/sessions/autosave'

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

      if (closedWindow.tabs) {
        const title = getWindowTitle(closedWindow.tabs)
        await createSessionFromWindows(
          localStorageKeys.PREVIOUS_SESSIONS,
          [closedWindow],
          title
        )
        return
      }
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
    const title = getSessionTitle(currentSession.windows)
    if (!currentSession.title) {
      currentSession.title = title
    }
    await saveNewSession(localStorageKeys.PREVIOUS_SESSIONS, currentSession)
    await removeSession(localStorageKeys.CURRENT_SESSION)
  }
}

export const handleClosedWindow = async (closedWindowId: number) => {
  log.debug(logContext, 'handleClosedWindow()', closedWindowId)

  try {
    await autoSaveSession(closedWindowId)
    await updateSessionsDebounce()
  } catch (err) {
    log.error(logContext, 'handleClosedWindow', err)
  }
}
