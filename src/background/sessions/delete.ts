import { log } from 'src/utils/logger'
import { closeTab, closeWindow } from 'src/utils/browser/query'
import {
  localStorageKeys,
  patchSessionInCollection,
  deleteSessionInCollection,
} from 'src/utils/browser/storage'
import { isDefined } from 'src/utils/helpers'
import { findSessionWithKey } from './query'
import { throwSessionId, throwWindowId, throwTabId } from '../errors'

const logContext = 'background/sessions/delete'

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
