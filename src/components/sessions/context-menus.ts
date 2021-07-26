import { contextIds, contextMenu } from 'src/components/context-menu/store'
import type { SessionLists } from 'src/utils/browser/storage'
import { isDefined, parseNum } from 'src/utils/helpers'
import Open from 'src/components/icons/open.svelte'
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
  contextMenu.register(contextIds.SESSION, {
    items: (target) => {
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
            Icon: Open,
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
    },
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
    contextMenu.register(contextIds.WINDOW, {
      items: (target) => {
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
              Icon: Open,
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
      },
    })
  }
}

type RegisterTabContextMenuArgs = {
  sessionLists: SessionLists
  openTab: (sessionId: string, windowId: number, tabId: number) => Promise<void>
  removeTab: (
    sessionId: string,
    windowId: number,
    tabId: number
  ) => Promise<void>
}

export const registerTabContextMenu = ({
  sessionLists,
  openTab,
  removeTab,
}: RegisterTabContextMenuArgs) => {
  if (sessionLists) {
    contextMenu.register(contextIds.TAB, {
      onClose: (target) => {
        target.classList.remove('underline')
      },
      items: (target) => {
        target.classList.add('underline')
        const sessionId = target.dataset.sessionId
        const windowId = parseNum(target.dataset.windowId)
        const tabId = parseNum(target.dataset.tabId)

        if (isDefined(sessionId) && isDefined(windowId) && isDefined(tabId)) {
          const handleOpen = () => {
            void openTab(sessionId, windowId, tabId)
          }

          const handleDelete = () => {
            void removeTab(sessionId, windowId, tabId)
          }

          return [
            {
              onClick: handleOpen,
              Icon: Open,
              text: sessionLists.current.id === sessionId ? 'Focus' : 'Open',
            },
            {
              onClick: handleDelete,
              Icon: Bin,
              text: sessionLists.current.id === sessionId ? 'Close' : 'Delete',
            },
          ]
        }

        return []
      },
    })
  }
}
