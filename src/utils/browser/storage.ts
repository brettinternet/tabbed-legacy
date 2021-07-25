// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/set
import { v4 as uuidv4 } from 'uuid'

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

export type Session = {
  id: string
  title?: string
  lastModifiedDate: string
  windows: browser.windows.Window[]
  lastSavedDate?: string
}

export type SessionLists = {
  current: Session
  previous: Session[]
  saved: Session[]
}

export const initSession = (windows: Session['windows']): Session => ({
  id: uuidv4(),
  lastModifiedDate: new Date().toJSON(),
  windows,
})

export const saveSession = async (key: LocalStorageKey, session: Session) => {
  if (session.windows.length > 0) {
    session.lastSavedDate = new Date().toJSON()
    await browser.storage.local.set({
      [key]: session,
    })
  }
}

export const removeSession = async (key: LocalStorageKey) => {
  await browser.storage.local.remove(key)
}

export const readSession = async <T extends LocalStorageKey, U = Session>(
  key: T
): Promise<U | undefined> => {
  const res = await (browser.storage.local.get(key) as Promise<
    Record<T, U | undefined>
  >)
  return res?.[key]
}

export const readSessionCollection = async <T extends LocalStorageKey>(
  key: T
) => (await readSession<T, Session[]>(key)) || []

export const addSessionToCollection = async (
  key: LocalStorageKey,
  session: Session
) => {
  session.lastSavedDate = new Date().toJSON()
  const existing = await readSessionCollection(key)
  await browser.storage.local.set({
    [key]: [session, ...existing],
  })
}

export const deleteSession = async (
  key: LocalStorageKey,
  sessionId: string
) => {
  const existing = await readSessionCollection(key)
  await browser.storage.local.set({
    [key]: existing.filter(({ id }) => id !== sessionId),
  })
}

export const patchSessionInCollection = async (
  key: LocalStorageKey,
  session: Session
) => {
  if (session.windows.length > 0) {
    const existing = await readSessionCollection(key)
    const updateIndex = existing.findIndex(({ id }) => id === session.id)
    session.lastModifiedDate = new Date().toJSON()
    session.lastSavedDate = new Date().toJSON()
    existing.splice(updateIndex, 1, session)
    await browser.storage.local.set({
      [key]: existing,
    })
  } else {
    await deleteSession(key, session.id)
  }
}
