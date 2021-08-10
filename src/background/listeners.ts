import type { Settings } from 'src/utils/settings'
import { updateLogLevel, log } from 'src/utils/logger'
import {
  MESSAGE_TYPE_RELOAD_ACTIONS,
  MESSAGE_TYPE_RELOAD_TAB_LISTENERS,
  MESSAGE_TYPE_UPDATE_LOG_LEVEL,
  MESSAGE_TYPE_RELOAD_CLOSED_WINDOW_LISTENER,
  MESSAGE_TYPE_UPDATE_POPOUT_POSITION,
} from 'src/utils/messages'
import type {
  ReloadActionsMessage,
  ReloadTabListenersMessage,
  UpdateLogLevelMessage,
  ReloadClosedWindowListenerMessage,
  UpdatePopoutPositionMessage,
} from 'src/utils/messages'
import {
  updatePopoutPosition,
  loadExtensionActions,
  loadTabCountListeners,
} from './configuration'
import {
  setupSessionListeners,
  loadClosedWindowListener,
} from './sessions/listeners'
import { setupSearchListeners } from './search/listeners'
import { setupUndoListeners } from './undo/listeners'

const logContext = 'background/listeners'

const setupConfigurationListeners = () => {
  browser.runtime.onMessage.addListener((message: ReloadActionsMessage) => {
    if (message.type === MESSAGE_TYPE_RELOAD_ACTIONS) {
      void loadExtensionActions(message.value)
    }

    return false
  })

  browser.runtime.onMessage.addListener(
    (message: ReloadTabListenersMessage) => {
      if (message.type === MESSAGE_TYPE_RELOAD_TAB_LISTENERS) {
        loadTabCountListeners(message.value)
      }

      return false
    }
  )

  browser.runtime.onMessage.addListener((message: UpdateLogLevelMessage) => {
    if (message.type === MESSAGE_TYPE_UPDATE_LOG_LEVEL) {
      void updateLogLevel(message.value)
    }

    return false
  })

  browser.runtime.onMessage.addListener(
    (message: ReloadClosedWindowListenerMessage) => {
      if (message.type === MESSAGE_TYPE_RELOAD_CLOSED_WINDOW_LISTENER) {
        void loadClosedWindowListener(message.value)
      }

      return false
    }
  )

  browser.runtime.onMessage.addListener(
    (message: UpdatePopoutPositionMessage) => {
      if (message.type === MESSAGE_TYPE_UPDATE_POPOUT_POSITION) {
        return updatePopoutPosition(message.value)
      }

      return false
    }
  )
}

export const setupListeners = (settings: Settings) => {
  log.debug(logContext, 'setupListeners()', settings)

  void setupConfigurationListeners()
  void setupSessionListeners()
  void loadTabCountListeners(settings.showTabCountBadge)
  void loadClosedWindowListener(settings.saveClosedWindows)
  void setupSearchListeners()
  void setupUndoListeners()
}
