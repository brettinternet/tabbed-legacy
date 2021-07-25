import { writable, get } from 'svelte/store'

import { sortWindows } from 'src/utils/browser/query'
import { contextIds, contextMenu } from 'src/components/context-menu/store'
import type { ClickOptionEventHandler } from 'src/components/context-menu/store'
import type { SessionLists } from 'src/utils/browser/storage'
import Window from 'src/components/icons/window.svelte'
import Save from 'src/components/icons/save.svelte'
import Bin from 'src/components/icons/bin.svelte'

export const currentWindowId = writable<number | undefined>()
export const currentTabId = writable<number | undefined>()
export const sessionLists = writable<SessionLists | undefined>()
export const selectedSessionId = writable<string | undefined>()

export const sortCurrentSession = async (activeWindowId?: number) => {
  const session = get(sessionLists)
  if (session) {
    const windows = await sortWindows(session.current.windows, activeWindowId)
    sessionLists.update((state) =>
      state
        ? {
            ...state,
            current: {
              ...state.current,
              windows,
            },
          }
        : undefined
    )
  }
}

type RegistrationArgs = {
  currentSessionId: string
  openSession: (id: string) => void
  saveSession: (id: string) => void
  deleteSession: (id: string) => void
}

export const registerContextMenu = ({
  currentSessionId,
  openSession,
  saveSession,
  deleteSession,
}: RegistrationArgs) => {
  contextMenu.register(contextIds.SESSION, (target) => {
    const handleClickOpen: ClickOptionEventHandler = () => {
      const sessionId = target.id
      if (sessionId) {
        void openSession(sessionId)
      }
    }

    const handleClickSave: ClickOptionEventHandler = () => {
      const sessionId = target.id
      if (sessionId) {
        void saveSession(sessionId)
      }
    }

    const handleClickDelete: ClickOptionEventHandler = () => {
      const sessionId = target.id
      if (sessionId) {
        void deleteSession(sessionId)
      }
    }

    return [
      {
        onClick: handleClickOpen,
        disabled: target?.id === currentSessionId,
        Icon: Window,
        text: 'Open',
      },
      {
        onClick: handleClickSave,
        // disabled: true,
        Icon: Save,
        text: 'Save',
      },
      {
        onClick: handleClickDelete,
        disabled: target?.id === currentSessionId,
        Icon: Bin,
        text: 'Delete',
      },
    ]
  })
}
