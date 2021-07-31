import { onDestroy } from 'svelte'

import type { PushUpdateSessionListsMessage } from 'src/utils/messages'
import { MESSAGE_TYPE_PUSH_UPDATE_SESSION_LISTS } from 'src/utils/messages'
import { log } from 'src/utils/logger'
import { sessionLists } from 'src/components/sessions/store'
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

  browser.runtime.onMessage.addListener(respondToSessionsUpdate)
  browser.tabs.onActivated.addListener(handleActiveTabChange)
  browser.windows.onFocusChanged.addListener(handleFocusWindowChange)

  onDestroy(() => {
    browser.runtime.onMessage.removeListener(respondToSessionsUpdate)
    browser.tabs.onActivated.removeListener(handleActiveTabChange)
    browser.windows.onFocusChanged.removeListener(handleFocusWindowChange)
  })
}
