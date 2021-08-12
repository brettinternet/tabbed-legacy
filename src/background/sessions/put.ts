import type { PatchWindowOptions, PatchTabOptions } from 'src/utils/messages'
import {
  localStorageKeys,
  patchSession,
  patchSessionInCollection,
} from 'src/utils/browser/storage'
import { log } from 'src/utils/logger'
import { isDefined, move } from 'src/utils/helpers'
import { getTabUrl, openTab, openWindow } from 'src/utils/browser/query'
import { findSessionWithKey } from './query'
import { throwSessionId, throwWindowId, throwTabId } from '../errors'

const logContext = 'background/sessions/put'

export const updateSession = async ({
  sessionId,
  title,
}: {
  sessionId: string
  title: string | undefined
}) => {
  log.debug(logContext, 'updateSession()', { sessionId, title })

  const { key, session } = await findSessionWithKey(sessionId)
  if (key && session) {
    session.title = title
    await patchSession(key, session)
  } else {
    throwSessionId(sessionId)
  }
}

export const addWindowToSession = async ({
  sessionId,
  win,
  index,
}: {
  sessionId: string
  win: browser.windows.Window
  index?: number
}) => {
  log.debug(logContext, 'addWindowToSession()', { sessionId, window, index })

  const { key, session } = await findSessionWithKey(sessionId)
  if (key && session) {
    if (key === localStorageKeys.CURRENT_SESSION) {
      await openWindow(win)
    } else {
      if (isDefined(index)) {
        session.windows.splice(index, 0, win)
      } else {
        session.windows.push(win)
      }
      await patchSession(key, session)
    }
  } else {
    throwSessionId(sessionId)
  }
}

export const addTabToSessionWindow = async ({
  sessionId,
  tab,
  windowIndex,
  index,
}: {
  sessionId: string
  tab: browser.tabs.Tab
  windowIndex: number
  index?: number
}) => {
  log.debug(logContext, 'addTabToSessionWindow()', { sessionId, tab, index })

  const { key, session } = await findSessionWithKey(sessionId)
  if (key && session) {
    if (key === localStorageKeys.CURRENT_SESSION) {
      const url = getTabUrl(tab)
      const { pinned, windowId, incognito } = tab
      if (url) {
        await openTab({ url, pinned, windowId, incognito })
      }
    } else {
      if (isDefined(index)) {
        session.windows[windowIndex].tabs?.splice(index, 0, tab)
      } else {
        session.windows[windowIndex].tabs?.push(tab)
      }
      await patchSession(key, session)
    }
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

// TODO: if not current, need to also move pinned tab to last index of pinned tabs
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
      await browser.tabs.update(tabId, options)
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
  sessionId,
  windowId,
  tabIds,
  index,
}: {
  sessionId: string
  windowId: number
  tabIds: number | number[]
  index: browser.tabs._MoveMoveProperties['index']
}) => {
  log.debug(logContext, 'moveTabs()', { sessionId, windowId, tabIds, index })
  const { key, session } = await findSessionWithKey(sessionId)

  if (key && session) {
    if (key === localStorageKeys.CURRENT_SESSION) {
      await browser.tabs.move(tabIds, { windowId, index })
    } else {
      const windowIndex = session.windows.findIndex((w) => w.id === windowId)
      if (windowIndex > -1) {
        const tabs = session.windows[windowIndex].tabs
        if (tabs) {
          const tabIdsArr = Array.isArray(tabIds) ? tabIds : [tabIds]
          const moveTabs = tabs.filter(({ id }) => id && tabIdsArr.includes(id))
          moveTabs.forEach((tab, i) => {
            move(tabs, tab.index, index + i)
          })
          session.windows[windowIndex].tabs = tabs
          await patchSessionInCollection(key, session)
        } else {
          throw Error('No tabs found')
        }
      } else {
        throwWindowId(windowId)
      }
    }
  } else {
    throwSessionId(sessionId)
  }
}
