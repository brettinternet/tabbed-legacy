import { focusWindow, openWindow, closeWindow } from 'src/utils/browser/query'
import { contextIds, contextMenu } from 'src/components/context-menu/store'
import {
  localStorageKeys,
  patchSessionInCollection,
} from 'src/utils/browser/storage'
import type { LocalStorageKey, SessionLists } from 'src/utils/browser/storage'
import { parseNum } from 'src/utils/helpers'
import Window from 'src/components/icons/window.svelte'
import Save from 'src/components/icons/save.svelte'
import Bin from 'src/components/icons/bin.svelte'

type RegisterSessionsContextMenuArgs = {
  currentSessionId: string
  openSession: (id: string) => void
  saveSession: (id: string) => void
  deleteSession: (id: string) => void
}

export const registerSessionsContextMenu = ({
  currentSessionId,
  openSession,
  saveSession,
  deleteSession,
}: RegisterSessionsContextMenuArgs) => {
  contextMenu.register(contextIds.SESSION, (target) => {
    const sessionId = target.id

    const handleOpen = () => {
      if (sessionId) {
        void openSession(sessionId)
      }
    }

    const handleSave = () => {
      if (sessionId) {
        void saveSession(sessionId)
      }
    }

    const handleDelete = () => {
      if (sessionId) {
        void deleteSession(sessionId)
      }
    }

    return [
      {
        onClick: handleOpen,
        disabled: target?.id === currentSessionId,
        Icon: Window,
        text: 'Open',
      },
      {
        onClick: handleSave,
        Icon: Save,
        text: 'Save',
      },
      {
        onClick: handleDelete,
        disabled: target?.id === currentSessionId,
        Icon: Bin,
        text: 'Delete',
      },
    ]
  })
}

export const registerWindowContextMenu = (sessionLists: SessionLists) => {
  if (sessionLists) {
    contextMenu.register(contextIds.WINDOW, (target) => {
      const sessionId = target.dataset.sessionId
      const windowId = parseNum(target.dataset.windowId)

      const saveAction = {
        onClick: console.log,
        Icon: Save,
        text: 'Save',
      }

      if (sessionLists.current.id === sessionId) {
        const handleFocus = async () => {
          if (windowId) {
            await focusWindow(windowId)
          }
        }

        const handleClose = async () => {
          if (windowId) {
            await closeWindow(windowId)
          }
        }

        return [
          {
            onClick: handleFocus,
            Icon: Window,
            text: 'Focus',
          },
          saveAction,
          {
            onClick: handleClose,
            Icon: Bin,
            text: 'Close',
          },
        ]
      } else {
        const handleOpen = async () => {
          if (windowId) {
            const selectedSession = [
              ...(sessionLists?.previous || []),
              ...(sessionLists?.saved || []),
            ].find((s) => s?.id === sessionId)
            const selectWindow = selectedSession?.windows.find(
              (w) => w?.id === windowId
            )
            if (selectWindow) {
              await openWindow(selectWindow)
            }
          }
        }

        const handleDelete = async () => {
          if (windowId) {
            let key: LocalStorageKey | undefined
            let session = sessionLists.previous.find(
              ({ id }) => id === sessionId
            )
            if (session) {
              key = localStorageKeys.PREVIOUS_SESSIONS
            } else {
              session = sessionLists.saved.find(({ id }) => id === sessionId)
              key = localStorageKeys.USER_SAVED_SESSIONS
            }

            if (key && session) {
              const windowIndex = session.windows.findIndex(
                ({ id }) => id === windowId
              )
              session.windows.splice(windowIndex, 1)
              await patchSessionInCollection(key, session)
            }
          }
        }

        return [
          {
            onClick: handleOpen,
            Icon: Window,
            text: 'Open',
          },
          saveAction,
          {
            onClick: handleDelete,
            Icon: Bin,
            text: 'Delete',
          },
        ]
      }
    })
  }
}
