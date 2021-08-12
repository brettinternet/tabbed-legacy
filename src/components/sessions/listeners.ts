import { onDestroy } from 'svelte'

import type {
  PushUpdateSessionListsMessage,
  UpdateSelectedSessionIdMessage,
} from 'src/utils/messages'
import {
  MESSAGE_TYPE_PUSH_UPDATE_SESSION_LISTS,
  MESSAGE_TYPE_UPDATE_SELECTED_SESSION_ID,
} from 'src/utils/messages'
import { log } from 'src/utils/logger'
import { sessionLists, selectedSessionId } from 'src/components/sessions/store'
import {
  handleActiveTabChange,
  handleFocusWindowChange,
} from 'src/components/sessions/handlers'

const logContext = 'components/sessions/listeners'

export const setupListeners = () => {
  const respondToSessionsUpdate = (message: PushUpdateSessionListsMessage) => {
    if (message.type === MESSAGE_TYPE_PUSH_UPDATE_SESSION_LISTS) {
      log.debug(logContext, 'respondToSessionsUpdate()', message.value)

      sessionLists.set(message.value)
    }

    return false
  }

  const updateSelectedSessionId = (message: UpdateSelectedSessionIdMessage) => {
    if (message.type === MESSAGE_TYPE_UPDATE_SELECTED_SESSION_ID) {
      log.debug(logContext, 'respondToSessionsUpdate()', message.value)

      selectedSessionId.set(message.value)
      const button: HTMLButtonElement | null = document.querySelector(
        `button#${message.value}`
      )
      if (button) {
        button.focus()
      }
    }

    return false
  }

  browser.runtime.onMessage.addListener(respondToSessionsUpdate)
  browser.runtime.onMessage.addListener(updateSelectedSessionId)
  browser.tabs.onActivated.addListener(handleActiveTabChange)
  browser.windows.onFocusChanged.addListener(handleFocusWindowChange)

  onDestroy(() => {
    browser.runtime.onMessage.removeListener(respondToSessionsUpdate)
    browser.runtime.onMessage.removeListener(updateSelectedSessionId)
    browser.tabs.onActivated.removeListener(handleActiveTabChange)
    browser.windows.onFocusChanged.removeListener(handleFocusWindowChange)
  })
}
