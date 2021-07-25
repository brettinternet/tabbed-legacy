import { contextIds, contextMenu } from 'src/components/context-menu/store'
import type { SessionLists } from 'src/utils/browser/storage'
import { isDefined, parseNum } from 'src/utils/helpers'
import Window from 'src/components/icons/window.svelte'
import Save from 'src/components/icons/save.svelte'
import Bin from 'src/components/icons/bin.svelte'

type RegisterSessionsContextMenuArgs = {
  currentSessionId: string
  openSession: (sessionId: string) => Promise<void>
  saveSession: (sessionId: string) => Promise<void>
  deleteSession: (sessionId: string) => Promise<void>
}

export const registerSessionsContextMenu = ({
  currentSessionId,
  openSession,
  saveSession,
  deleteSession,
}: RegisterSessionsContextMenuArgs) => {
  contextMenu.register(contextIds.SESSION, (target) => {
    const sessionId = target.id

    if (sessionId) {
      const handleOpen = () => {
        void openSession(sessionId)
      }
      const handleSave = () => {
        void saveSession(sessionId)
      }

      const handleDelete = () => {
        void deleteSession(sessionId)
      }

      return [
        {
          onClick: handleOpen,
          disabled: sessionId === currentSessionId,
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
          disabled: sessionId === currentSessionId,
          Icon: Bin,
          text: 'Delete',
        },
      ]
    }

    return []
  })
}

type RegisterWindowContextMenuArgs = {
  sessionLists: SessionLists
  openWindow: (sessionId: string, windowId: number) => Promise<void>
  saveWindow: (sessionId: string, windowId: number) => Promise<void>
  removeWindow: (sessionId: string, windowId: number) => Promise<void>
}

export const registerWindowContextMenu = ({
  sessionLists,
  openWindow,
  saveWindow,
  removeWindow,
}: RegisterWindowContextMenuArgs) => {
  if (sessionLists) {
    contextMenu.register(contextIds.WINDOW, (target) => {
      const sessionId = target.dataset.sessionId
      const windowId = parseNum(target.dataset.windowId)

      if (isDefined(sessionId) && isDefined(windowId)) {
        const handleOpen = () => {
          void openWindow(sessionId, windowId)
        }

        const handleSave = () => {
          void saveWindow(sessionId, windowId)
        }

        const handleDelete = () => {
          void removeWindow(sessionId, windowId)
        }

        return [
          {
            onClick: handleOpen,
            Icon: Window,
            text: sessionLists.current.id === sessionId ? 'Focus' : 'Open',
          },
          {
            onClick: handleSave,
            Icon: Save,
            text: 'Save',
          },
          {
            onClick: handleDelete,
            Icon: Bin,
            text: sessionLists.current.id === sessionId ? 'Close' : 'Delete',
          },
        ]
      }

      return []
    })
  }
}