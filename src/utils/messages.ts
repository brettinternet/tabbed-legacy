import type { Settings } from 'src/utils/settings'
import type { SessionLists, Session } from 'src/utils/browser/storage'

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

export const MESSAGE_TYPE_UPDATE_POPOUT_POSITION = 'update_popout_position'
export type UpdatePopoutPositionMessage = MessageWithValue<
  typeof MESSAGE_TYPE_UPDATE_POPOUT_POSITION,
  Settings['popoutState']
>

// session list actions
export const MESSAGE_TYPE_UPDATE_SESSIONS_LIST = 'update_sessions'
export type UpdateSessionsListMessage = MessageWithValue<
  typeof MESSAGE_TYPE_UPDATE_SESSIONS_LIST,
  SessionLists
>

export const MESSAGE_TYPE_GET_SESSION_LISTS = 'get_session_lists'
export type GetSessionListsMessage = Message<
  typeof MESSAGE_TYPE_GET_SESSION_LISTS
>
export type GetSessionListsResponse = SessionLists

export const MESSAGE_TYPE_GET_ALL_SESSIONS = 'get_all_sessions'
export type GetAllSessionsMessage = Message<
  typeof MESSAGE_TYPE_GET_ALL_SESSIONS
>
export type GetAllSessionsResponse = Session[]

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

export type OpenWindowOptions = {
  noFocus?: boolean
}
export const MESSAGE_TYPE_OPEN_SESSION_WINDOW = 'open_session_window'
export type OpenSessionWindowMessage = MessageWithValue<
  typeof MESSAGE_TYPE_OPEN_SESSION_WINDOW,
  { sessionId: string; windowId: number; options?: OpenWindowOptions }
>

export type OpenTabOptions = {
  noFocus?: boolean
}
export const MESSAGE_TYPE_OPEN_SESSION_TAB = 'open_session_tab'
export type OpenSessionTabMessage = MessageWithValue<
  typeof MESSAGE_TYPE_OPEN_SESSION_TAB,
  {
    sessionId: string
    windowId: number
    tabId: number
    options?: OpenTabOptions
  }
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

// extra tab actions
export const MESSAGE_TYPE_MOVE_TABS = 'move_tabs'
export type MoveTabsMessage = MessageWithValue<
  typeof MESSAGE_TYPE_MOVE_TABS,
  { tabIds: number | number[]; options: browser.tabs._MoveMoveProperties }
>

export const MESSAGE_TYPE_DISCARD_TABS = 'discard_tabs'
export type DiscardTabsMessage = MessageWithValue<
  typeof MESSAGE_TYPE_DISCARD_TABS,
  { tabIds: number | number[] }
>

export const MESSAGE_TYPE_FIND_DUPLICATE_SESSION_TABS =
  'find_duplicate_session_tabs'
export type FindDuplicateSessionTabsMessage = MessageWithValue<
  typeof MESSAGE_TYPE_FIND_DUPLICATE_SESSION_TABS,
  { sessionId: string }
>
export type FindDuplicateSessionTabsResponse = string[] // urls

// download/backup
export type DownloadSessionsOptions = {
  sessionIds?: string | string[]
}
export const MESSAGE_TYPE_DOWNLOAD_SESSIONS = 'download_sessions'
export type DownloadSessionsMessage = MessageWithValue<
  typeof MESSAGE_TYPE_DOWNLOAD_SESSIONS,
  DownloadSessionsOptions
>

export const MESSAGE_TYPE_IMPORT_SESSIONS_FROM_TEXT =
  'import_sessions_from_text'
export type ImportSessionsFromTextMessage = MessageWithValue<
  typeof MESSAGE_TYPE_IMPORT_SESSIONS_FROM_TEXT,
  { content: string }
>
