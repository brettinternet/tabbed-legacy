import { tick } from 'svelte'
import { get } from 'svelte/store'
import hotkeys from 'hotkeys-js'
import { noop } from 'lodash'

import { isPopup } from 'src/components/app/store'
import { modal, someModal } from 'src/components/modal/store'
import { log } from 'src/utils/logger'
import {
  selectedSessionId,
  forceUpdateSessions,
  editSession,
  sessionLists,
} from 'src/components/sessions/store'
import {
  querySession,
  deleteSession,
  removeTab,
  removeWindow,
} from 'src/components/sessions/send'
import { parseNum, isDefined } from 'src/utils/helpers'
import { sessionTypes } from 'src/utils/browser/storage'
import { toast } from 'src/components/toast/store'
import { undo, redo } from 'src/components/app/send'

const logContext = 'components/settings/hotkeys'

const handleDelete = async (ev: KeyboardEvent) => {
  const target = ev.target
  if (target instanceof HTMLElement) {
    const sessionId = target.dataset.sessionId
    if (sessionId) {
      const sessionType = target.dataset.sessionType
      const windowId = parseNum(target.dataset.windowId)
      const tabId = parseNum(target.dataset.tabId)
      const isCurrent = sessionType !== sessionTypes.CURRENT
      if (isDefined(tabId) && isDefined(windowId)) {
        await removeTab(sessionId, windowId, tabId)
        toast.push({ message: `Tab ${isCurrent ? 'closed' : 'removed'}` })
      } else if (isDefined(windowId)) {
        await removeWindow(sessionId, windowId)
        toast.push({ message: `Window ${isCurrent ? 'closed' : 'removed'}` })
      } else if (isCurrent) {
        await deleteSession(sessionId)
        toast.push({ message: 'Session deleted' })
      }
      await forceUpdateSessions()
    }
  }
}

const openSessionEdit = async () => {
  const sessionId = get(selectedSessionId)
  if (sessionId) {
    const session = await querySession({ sessionId })
    if (session && session.type === sessionTypes.SAVED) {
      editSession.set(session)
      modal.sessionEdit.set(true)
    }
  }
}

const handleSelectCurrentSession = () => {
  const current = get(sessionLists)?.current
  if (current) {
    selectedSessionId.set(current.id)
  }
}

const shortcutScopes = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
}

type ShortcutEntry = {
  hotkey: string
  display: string
}
type Shortcuts = Record<string, ShortcutEntry>
export const shortcuts: Shortcuts = {
  question: {
    hotkey: 'shift+/', // `?` mark
    display: '?',
  },
  escape: {
    hotkey: 'esc',
    display: 'Esc',
  },
  slash: {
    hotkey: '/',
    display: '/',
  },
  backtick: {
    hotkey: '`',
    display: '`',
  },
  delete: {
    hotkey: 'delete',
    display: 'Del',
  },
  backspace: {
    hotkey: 'backspace',
    display: 'Backspace',
  },
  ctrl_z: {
    hotkey: 'ctrl+z',
    display: 'Ctrl+z',
  },
  ctrl_y: {
    hotkey: 'ctrl+y',
    display: 'Ctrl+y',
  },
  i: {
    hotkey: 'i',
    display: 'i',
  },
  r: {
    hotkey: 'r',
    display: 'r',
  },
  c: {
    hotkey: 'c',
    display: 'c',
  },
} as const

/**
 * @docs https://github.com/jaywcjlove/hotkeys
 */
export const setupShortcuts = (enabled: boolean) => {
  log.debug(logContext, 'setupShortcuts', enabled)
  const hotkeyShortcuts = Object.values(shortcuts)
    .map(({ hotkey }) => hotkey)
    .join(',')

  if (enabled) {
    hotkeys(hotkeyShortcuts, shortcutScopes.ENABLED, (event, handler) => {
      if (enabled) {
        event.preventDefault()
        switch (handler.key) {
          case shortcuts.question.hotkey:
            modal.shortcuts.toggle()
            break
          case shortcuts.escape.hotkey:
            if (get(someModal)) {
              modal.off()
            } else if (isPopup) {
              window.close()
            }
            break
          case shortcuts.slash.hotkey: {
            modal.off()
            const search = document.getElementById('search')
            void tick().then(() => {
              search?.focus()
            })
            break
          }
          case shortcuts.backtick.hotkey:
            modal.settings.toggle()
            break
          case shortcuts.i.hotkey:
            modal.importer.set(true)
            break
          case shortcuts.r.hotkey:
            void openSessionEdit()
            break
          case shortcuts.backspace.hotkey:
          case shortcuts.delete.hotkey:
            void handleDelete(event)
            break
          case shortcuts.ctrl_z.hotkey:
            void undo()
            break
          case shortcuts.ctrl_y.hotkey:
            void redo()
            break
          case shortcuts.c.hotkey:
            handleSelectCurrentSession()
            break
        }
      }
    })
  } else {
    hotkeys('', shortcutScopes.DISABLED, noop)
  }

  // https://github.com/jaywcjlove/hotkeys/issues/90
  hotkeys.setScope(shortcutScopes[enabled ? 'ENABLED' : 'DISABLED'])
  hotkeys.deleteScope(shortcutScopes[enabled ? 'DISABLED' : 'ENABLED'])

  log.debug(logContext, `hotkeys scope: '${hotkeys.getScope()}'`)
}
