import type { Settings } from 'src/utils/settings'
import type { SessionLists } from 'src/utils/browser/storage'

type MessageWithValue<T, U = undefined> = {
  type: T
  value: U
}

type Message<T> = {
  type: T
}

export const MESSAGE_TYPE_RELOAD_ACTIONS = 'reload_actions'
export type ReloadActionsMessage = MessageWithValue<
  typeof MESSAGE_TYPE_RELOAD_ACTIONS,
  Settings['extensionClickAction']
>

export const MESSAGE_TYPE_RELOAD_TAB_LISTENERS = 'reload_tab_listeners'
export type ReloadTabListenersMessage = MessageWithValue<
  typeof MESSAGE_TYPE_RELOAD_TAB_LISTENERS,
  boolean
>

export const MESSAGE_TYPE_UPDATE_LOG_LEVEL = 'update_log_level'
export type UpdateLogLevelMessage = MessageWithValue<
  typeof MESSAGE_TYPE_UPDATE_LOG_LEVEL,
  boolean
>

export const MESSAGE_TYPE_UPDATE_SESSIONS_LIST = 'update_sessions'
export type UpdateSessionsListMessage = MessageWithValue<
  typeof MESSAGE_TYPE_UPDATE_SESSIONS_LIST,
  SessionLists
>

export const MESSAGE_TYPE_GET_SESSIONS_LIST = 'get_sessions'
export type GetSessionsListMessage = Message<
  typeof MESSAGE_TYPE_GET_SESSIONS_LIST
>

export type GetSessionsListResponse = SessionLists

export const MESSAGE_TYPE_RELOAD_CLOSED_WINDOW_LISTENER = 'reload_closed_window_listener'
export type ReloadClosedWindowListener = MessageWithValue<
  typeof MESSAGE_TYPE_RELOAD_CLOSED_WINDOW_LISTENER,
  boolean
>
