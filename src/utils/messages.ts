import type { Settings } from 'src/utils/settings'

type MessageWithValue<T, U = undefined> = {
  type: T
  value: U
}

export const MESSAGE_TYPE_RELOAD_ACTIONS = 'reload_actions'
export type ReloadActionsMessage = MessageWithValue<typeof MESSAGE_TYPE_RELOAD_ACTIONS, Settings['extensionClickAction']>

export const MESSAGE_TYPE_RELOAD_TAB_LISTENERS = 'reload_tab_listeners'
export type ReloadTabListeners = MessageWithValue<typeof MESSAGE_TYPE_RELOAD_TAB_LISTENERS, boolean>

export const MESSAGE_TYPE_UPDATE_LOG_LEVEL = 'update_log_level'
export type UpdateLogLevel = MessageWithValue<typeof MESSAGE_TYPE_UPDATE_LOG_LEVEL, boolean>
