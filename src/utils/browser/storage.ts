// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/set
import { v4 as uuidv4 } from 'uuid'

import { isProd } from 'src/utils/env'
import type { Settings } from 'src/utils/settings'
import type { Valueof } from 'src/utils/helpers'
import { defaultSettings } from 'src/utils/settings'

export const localStorageKeys = {
  SETTINGS: 'settings',
  CURRENT_SESSION: 'current_session',
  PREVIOUS_SESSIONS: 'previous_sessions',
  USER_SAVED_SESSIONS: 'user_saved_sessions',
} as const
export type LocalStorageKey = Valueof<typeof localStorageKeys>

export const readSettings = async (): Promise<Settings> => {
  const { settings } = await (browser.storage.local.get(
    localStorageKeys.SETTINGS
  ) as Promise<{ settings: Settings | undefined }>)
  if (settings) {
    return {
      ...defaultSettings,
      ...settings,
    }
  }
  return defaultSettings
}

export const writeSetting = async (settings: Partial<Settings>) => {
  const currentSettings = await readSettings()
  await browser.storage.local.set({
    [localStorageKeys.SETTINGS]: Object.assign({}, currentSettings, settings),
  })
}

export const sessionType = {
  CURRENT: 'current',
  PREVIOUS: 'previous',
  SAVED: 'saved',
}
export type SessionType = Valueof<typeof sessionType>

export type Session = {
  id: string
  title?: string
  windows: browser.windows.Window[]
  createdDate: string
  lastModifiedDate: string
  userSavedDate?: string
  type: SessionType
}

export type SessionLists = {
  current: Session
  previous: Session[]
  saved: Session[]
}

const getSessionType = (key: LocalStorageKey) => {
  switch (key) {
    case localStorageKeys.CURRENT_SESSION:
      return sessionType.CURRENT
    case localStorageKeys.PREVIOUS_SESSIONS:
      return sessionType.PREVIOUS
    case localStorageKeys.USER_SAVED_SESSIONS:
    default:
      return sessionType.SAVED
  }
}

const checkCollectionKey = (key: LocalStorageKey): boolean => {
  if (
    key === localStorageKeys.PREVIOUS_SESSIONS ||
    key === localStorageKeys.USER_SAVED_SESSIONS
  ) {
    return true
  }

  return false
}

/**
 * Save a single session
 */
const saveSingleSession = async (key: LocalStorageKey, session: Session) => {
  await browser.storage.local.set({
    [key]: session,
  })
}

export const patchSession = async (key: LocalStorageKey, session: Session) => {
  if (key === localStorageKeys.CURRENT_SESSION) {
    session.lastModifiedDate = new Date().toJSON()
    await saveSingleSession(key, session)
  } else {
    await patchSessionInCollection(key, session)
  }
}

const saveSessionToCollection = async (
  key: LocalStorageKey,
  session: Session
) => {
  if (checkCollectionKey(key)) {
    const existing = await readSessionCollection(key)
    await browser.storage.local.set({
      [key]: [session, ...(existing || [])],
    })
  } else {
    throw Error(`${key} is not a collection storage key`)
  }
}

/**
 * Initialize and save session
 */
export const createSessionFromWindows = async (
  key: LocalStorageKey,
  windows: Session['windows'],
  title?: string
) => {
  const now = new Date().toJSON()
  const session: Session = {
    id: uuidv4(),
    windows,
    createdDate: now,
    lastModifiedDate: now,
    type: getSessionType(key),
    title,
  }
  if (key === localStorageKeys.CURRENT_SESSION) {
    await saveSingleSession(key, session)
  } else {
    await saveSessionToCollection(key, session)
  }
  return session
}

/**
 * Save an existing session from current/previous session, or copying user saved sessions
 *
 * Saving an existing session needs a new ID in order to avoid duplicates
 */
export const saveNewSession = async (
  key: LocalStorageKey,
  session: Session,
  title?: string
) => {
  const now = new Date().toJSON()
  session.id = uuidv4()
  session.lastModifiedDate = now
  session.type = getSessionType(key)
  if (title) {
    session.title = title
  }
  if (key === localStorageKeys.CURRENT_SESSION) {
    await saveSingleSession(key, session)
  } else {
    if (key === localStorageKeys.USER_SAVED_SESSIONS) {
      session.userSavedDate = now
    }
    await saveSessionToCollection(key, session)
  }
}

/**
 * Remove entire session (current session which exists on its own key)
 */
export const removeSession = async (key: LocalStorageKey) => {
  await browser.storage.local.remove(key)
}

/**
 * Read a session category
 */
export const readSession = async <T extends LocalStorageKey, U = Session>(
  key: T
): Promise<U | undefined> => {
  const res = await (browser.storage.local.get(key) as Promise<
    Record<T, U | undefined>
  >)
  return res?.[key]
}

/**
 * Read all session from collection
 */
export const readSessionCollection = async <T extends LocalStorageKey>(
  key: T
) => (await readSession<T, Session[]>(key)) || []

/**
 * Delete a single session in a collection
 */
export const deleteSessionInCollection = async (
  key: LocalStorageKey,
  sessionId: string
) => {
  if (checkCollectionKey(key)) {
    const existing = await readSessionCollection(key)
    await browser.storage.local.set({
      [key]: existing.filter(({ id }) => id !== sessionId),
    })
  } else {
    throw Error(`${key} is not a collection storage key`)
  }
}

export const patchSessionInCollection = async (
  key: LocalStorageKey,
  session: Session
) => {
  if (checkCollectionKey(key)) {
    const existing = await readSessionCollection(key)
    const updateIndex = existing.findIndex(({ id }) => id === session.id)
    session.lastModifiedDate = new Date().toJSON()
    existing.splice(updateIndex, 1, session)
    await browser.storage.local.set({
      [key]: existing,
    })
  } else {
    throw Error(`${key} is not a collection storage key`)
  }
}

/**
 * @WARNING destructive, only use in dev
 */
export const purgeAllStorage = async () => {
  if (!isProd) {
    await browser.storage.local.clear()
  }
}
