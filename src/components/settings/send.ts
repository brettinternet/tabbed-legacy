import type {
  ReloadActionsMessage,
  ReloadTabListenersMessage,
  UpdateLogLevelMessage,
  ReloadClosedWindowListenerMessage,
} from 'src/utils/messages'
import {
  MESSAGE_TYPE_RELOAD_ACTIONS,
  MESSAGE_TYPE_RELOAD_TAB_LISTENERS,
  MESSAGE_TYPE_UPDATE_LOG_LEVEL,
  MESSAGE_TYPE_RELOAD_CLOSED_WINDOW_LISTENER,
} from 'src/utils/messages'
import type { Settings } from 'src/utils/settings'

export const reloadTabListeners = async (
  showTabCountBadge: Settings['showTabCountBadge']
) => {
  const message: ReloadTabListenersMessage = {
    type: MESSAGE_TYPE_RELOAD_TAB_LISTENERS,
    value: showTabCountBadge,
  }
  await browser.runtime.sendMessage(message)
}

export const reloadExtensionActions = async (
  extensionClickAction: Settings['extensionClickAction']
) => {
  const message: ReloadActionsMessage = {
    type: MESSAGE_TYPE_RELOAD_ACTIONS,
    value: extensionClickAction,
  }
  await browser.runtime.sendMessage(message)
}

export const updateBackgroundLogLevel = async (
  debugMode: Settings['debugMode']
) => {
  const message: UpdateLogLevelMessage = {
    type: MESSAGE_TYPE_UPDATE_LOG_LEVEL,
    value: debugMode,
  }
  await browser.runtime.sendMessage(message)
}

export const reloadClosedWindowListeners = async (
  saveClosedWindows: Settings['saveClosedWindows']
) => {
  const message: ReloadClosedWindowListenerMessage = {
    type: MESSAGE_TYPE_RELOAD_CLOSED_WINDOW_LISTENER,
    value: saveClosedWindows,
  }
  await browser.runtime.sendMessage(message)
}
