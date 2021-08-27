import { tick } from 'svelte'
import { get, writable } from 'svelte/store'
import hotkeys from 'hotkeys-js'

import type { Valueof } from 'src/utils/helpers'
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
import { focusRingEnabled } from 'src/components/focus/context'

const logContext = 'components/settings/hotkeys'

const shortcutScopes = {
  OPTIONAL: 'optional_hotkeys',
  REQUIRED: 'required_hotkeys',
  INPUT_SAFE: 'input_safe_hotkeys',
}

type ShortcutScope = Valueof<typeof shortcutScopes>

const createActiveScope = () => {
  const { subscribe, set } = writable<ShortcutScope>()

  return {
    subscribe,
    set: (scope: ShortcutScope) => {
      hotkeys.setScope(scope)
      set(scope)
    },
  }
}

const activeScope = createActiveScope()

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
    const currentButton: HTMLButtonElement | null = document.querySelector(
      "[data-session-type='current']"
    )
    currentButton?.focus()
  }
}

type ShortcutEntry = {
  hotkey: string
  display: string
}
type Shortcuts = Record<string, ShortcutEntry>
const optionalShortcuts = {
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

const requiredShortcuts = {
  tab: {
    hotkey: 'tab',
    display: 'Tab',
  },
  shift_tab: {
    hotkey: 'shift+tab',
    display: 'Shift+Tab',
  },
} as const

export const shortcuts = Object.assign({}, optionalShortcuts, requiredShortcuts)

const listShortcutHotkeys = (shortcuts: Shortcuts) =>
  Object.values(shortcuts)
    .map(({ hotkey }) => hotkey)
    .join(',')

/**
 * @docs https://github.com/jaywcjlove/hotkeys
 */
export const setupShortcuts = () => {
  log.debug(logContext, 'setupShortcuts()')

  const optionalHotkeyShortcuts = listShortcutHotkeys(optionalShortcuts)
  hotkeys(
    optionalHotkeyShortcuts,
    shortcutScopes.OPTIONAL,
    (event, handler) => {
      event.preventDefault()
      switch (handler.key) {
        case optionalShortcuts.question.hotkey:
          modal.shortcuts.toggle()
          break
        case optionalShortcuts.escape.hotkey:
          if (get(someModal)) {
            modal.off()
          } else if (isPopup) {
            window.close()
          }
          break
        case optionalShortcuts.slash.hotkey: {
          modal.off()
          const search = document.getElementById('search')
          void tick().then(() => {
            search?.focus()
          })
          break
        }
        case optionalShortcuts.backtick.hotkey:
          modal.settings.toggle()
          break
        case optionalShortcuts.i.hotkey:
          modal.importer.set(true)
          break
        case optionalShortcuts.r.hotkey:
          void openSessionEdit()
          break
        case optionalShortcuts.backspace.hotkey:
        case optionalShortcuts.delete.hotkey:
          void handleDelete(event)
          break
        case optionalShortcuts.ctrl_z.hotkey:
          void undo()
          break
        case optionalShortcuts.ctrl_y.hotkey:
          void redo()
          break
        case optionalShortcuts.c.hotkey:
          handleSelectCurrentSession()
          break
      }
    }
  )

  // No scope, qualifies as `all` scope
  const requiredHotkeyShortcuts = listShortcutHotkeys(requiredShortcuts)
  hotkeys(requiredHotkeyShortcuts, (_event, handler) => {
    switch (handler.key) {
      // Do not preventDefault tab key
      case requiredShortcuts.tab.hotkey:
      case requiredShortcuts.shift_tab.hotkey:
        focusRingEnabled.set(true)
        break
    }
  })

  /**
   * Narrow scope to only 'all' and input safe hotkey scope
   * TODO: first tab enables focus-ring and ev.preventDefault(), then tab changes focus
   * Discord does this
   */
  hotkeys.filter = (event) => {
    const target = event.target as HTMLElement | null
    var tagName = target?.tagName
    if (tagName) {
      hotkeys.setScope(
        /^(INPUT|TEXTAREA|SELECT)$/.test(tagName)
          ? shortcutScopes.INPUT_SAFE
          : get(activeScope)
      )
    }
    return true
  }
}

export const disableShortcuts = () => {
  activeScope.set(shortcutScopes.REQUIRED)
}

export const enableShortcuts = () => {
  activeScope.set(shortcutScopes.OPTIONAL)
}
