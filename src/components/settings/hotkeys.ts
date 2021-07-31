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
} from 'src/components/sessions/store'
import {
  querySession,
  deleteSession,
  removeTab,
  removeWindow,
} from 'src/components/sessions/send'
import { parseNum, isDefined } from 'src/utils/helpers'
import { sessionTypes } from 'src/utils/browser/storage'

const logContext = 'components/settings/hotkeys'

const handleDelete = async (ev: KeyboardEvent) => {
  const target = ev.target
  if (target instanceof HTMLElement) {
    const sessionId = target.dataset.sessionId
    if (sessionId) {
      const sessionType = target.dataset.sessionType
      const windowId = parseNum(target.dataset.windowId)
      const tabId = parseNum(target.dataset.tabId)
      if (isDefined(tabId) && isDefined(windowId)) {
        await removeTab(sessionId, windowId, tabId)
      } else if (isDefined(windowId)) {
        await removeWindow(sessionId, windowId)
      } else if (sessionType !== sessionTypes.CURRENT) {
        await deleteSession(sessionId)
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

const shortcutScopes = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
}

/**
 * @docs https://github.com/jaywcjlove/hotkeys
 */
export const setupShortcuts = (enabled: boolean) => {
  log.debug(logContext, 'setupShortcuts', enabled)

  if (enabled) {
    hotkeys(
      'shift+/,esc,/,`,i,r,delete,backspace',
      shortcutScopes.ENABLED,
      (event, handler) => {
        if (enabled) {
          event.preventDefault()
          switch (handler.key) {
            case 'shift+/': // `?` mark
              modal.shortcuts.toggle()
              break
            case 'esc':
              if (get(someModal)) {
                modal.off()
              } else if (isPopup) {
                window.close()
              }
              break
            case '/': {
              modal.off()
              const search = document.getElementById('search')
              void tick().then(() => {
                search?.focus()
              })
              break
            }
            case '`':
              modal.settings.toggle()
              break
            case 'i':
              modal.importer.set(true)
              break
            case 'r':
              void openSessionEdit()
              break
            case 'backspace':
            case 'delete':
              void handleDelete(event)
              break
          }
        }
      }
    )
  } else {
    hotkeys('', shortcutScopes.DISABLED, noop)
  }

  // https://github.com/jaywcjlove/hotkeys/issues/90
  hotkeys.setScope(shortcutScopes[enabled ? 'ENABLED' : 'DISABLED'])
  hotkeys.deleteScope(shortcutScopes[enabled ? 'DISABLED' : 'ENABLED'])

  log.debug(logContext, `hotkeys scope: '${hotkeys.getScope()}'`)
}
