import type { Settings } from 'src/utils/settings'
import type { SessionLists } from 'src/utils/browser/storage'

type MessageWithValue<T, U = undefined> = {
  type: T
  value: U
}

type Message<T> = {
  type: T
}

// settings
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

export const MESSAGE_TYPE_RELOAD_CLOSED_WINDOW_LISTENER =
  'reload_closed_window_listener'
export type ReloadClosedWindowListenerMessage = MessageWithValue<
  typeof MESSAGE_TYPE_RELOAD_CLOSED_WINDOW_LISTENER,
  boolean
>

// session list actions
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

// session actions

// save
export const MESSAGE_TYPE_SAVE_EXISTING_SESSION = 'save_existing_session'
export type SaveExistingSessionMessage = MessageWithValue<
  typeof MESSAGE_TYPE_SAVE_EXISTING_SESSION,
  { sessionId: string }
>

export const MESSAGE_TYPE_SAVE_WINDOW = 'save_window'
export type SaveWindowMessage = MessageWithValue<
  typeof MESSAGE_TYPE_SAVE_WINDOW,
  { sessionId: string; windowId: number }
>

// open
export const MESSAGE_TYPE_OPEN_SESSION = 'open_session'
export type OpenSessionMessage = MessageWithValue<
  typeof MESSAGE_TYPE_OPEN_SESSION,
  { sessionId: string }
>

export const MESSAGE_TYPE_OPEN_SESSION_WINDOW = 'open_session_window'
export type OpenSessionWindowMessage = MessageWithValue<
  typeof MESSAGE_TYPE_OPEN_SESSION_WINDOW,
  { sessionId: string; windowId: number }
>

export const MESSAGE_TYPE_OPEN_SESSION_TAB = 'open_session_tab'
export type OpenSessionTabMessage = MessageWithValue<
  typeof MESSAGE_TYPE_OPEN_SESSION_TAB,
  { sessionId: string; windowId: number; tabId: number }
>

// remove
export const MESSAGE_TYPE_DELETE_SESSION = 'delete_session'
export type DeleteSessionMessage = MessageWithValue<
  typeof MESSAGE_TYPE_DELETE_SESSION,
  { sessionId: string }
>

export const MESSAGE_TYPE_REMOVE_SESSION_WINDOW = 'remove_session_window'
export type RemoveSessionWindowMessage = MessageWithValue<
  typeof MESSAGE_TYPE_REMOVE_SESSION_WINDOW,
  { sessionId: string; windowId: number }
>

export const MESSAGE_TYPE_REMOVE_SESSION_TAB = 'remove_session_tab'
export type RemoveSessionTabMessage = MessageWithValue<
  typeof MESSAGE_TYPE_REMOVE_SESSION_TAB,
  { sessionId: string; windowId: number; tabId: number }
>

// update
export const MESSAGE_TYPE_RENAME_SESSION = 'rename_session'
export type RenameSessionMessage = MessageWithValue<
  typeof MESSAGE_TYPE_RENAME_SESSION,
  { sessionId: string; name: string }
>

export type PatchWindowOptions = Pick<
  browser.windows._UpdateUpdateInfo,
  'drawAttention' | 'focused' | 'state' | 'left' | 'top'
>
export const MESSAGE_TYPE_PATCH_WINDOW = 'patch_window'
export type PatchWindowMessage = MessageWithValue<
  typeof MESSAGE_TYPE_PATCH_WINDOW,
  { sessionId: string; windowId: number; options: PatchWindowOptions }
>

export type PatchTabOptions = Pick<
  browser.tabs._UpdateUpdateProperties,
  'url' | 'active' | 'highlighted' | 'pinned' | 'muted'
>
export const MESSAGE_TYPE_PATCH_TAB = 'patch_tab'
export type PatchTabMessage = MessageWithValue<
  typeof MESSAGE_TYPE_PATCH_TAB,
  {
    sessionId: string
    windowId: number
    tabId: number
    options: PatchTabOptions
  }
>

export const MESSAGE_TYPE_DISCARD_TABS = 'discard_tabs'
export type DiscardTabsMessage = MessageWithValue<
  typeof MESSAGE_TYPE_DISCARD_TABS,
  { tabIds: number | number[] }
>

export const MESSAGE_TYPE_MOVE_TABS = 'move_tabs'
export type MoveTabsMessage = MessageWithValue<
  typeof MESSAGE_TYPE_MOVE_TABS,
  { tabIds: number | number[]; options: browser.tabs._MoveMoveProperties }
>
