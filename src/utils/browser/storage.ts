// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/set
import type { Settings } from 'src/utils/settings'
import { defaultSettings } from 'src/utils/settings'

export const localStorageKeys = {
  SETTINGS: 'settings',
  CURRENT_SESSION: 'current_session',
  PREVIOUS_SESSIONS: 'previous_sessions',
  USER_SAVED_SESSIONS: 'user_saved_sessions',
} as const

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

export const saveCurrentSession = async (session: Session) => {
  session.lastSavedDate = new Date().toJSON()
  await browser.storage.local.set({
    [localStorageKeys.CURRENT_SESSION]: session,
  })
}

export const removeCurrentSession = async () => {
  await browser.storage.local.remove(localStorageKeys.CURRENT_SESSION)
}

export const readCurrentSession = async () => {
  const res = await (browser.storage.local.get(
    localStorageKeys.CURRENT_SESSION
  ) as Promise<{ [localStorageKeys.CURRENT_SESSION]: Session | undefined }>)
  return res?.[localStorageKeys.CURRENT_SESSION]
}

export const readPreviousSessions = async () => {
  const res = await (browser.storage.local.get(
    localStorageKeys.PREVIOUS_SESSIONS
  ) as Promise<{ [localStorageKeys.PREVIOUS_SESSIONS]: Session[] | undefined }>)
  return res?.[localStorageKeys.PREVIOUS_SESSIONS] || []
}

export const savePreviousSession = async (session: Session) => {
  session.lastSavedDate = new Date().toJSON()
  const existingSessions = await readPreviousSessions()
  await browser.storage.local.set({
    [localStorageKeys.PREVIOUS_SESSIONS]: [session, ...existingSessions],
  })
}

export const deletePreviousSession = async (sessionId: string) => {
  const existingSessions = await readPreviousSessions()
  await browser.storage.local.set({
    [localStorageKeys.PREVIOUS_SESSIONS]: existingSessions.filter(
      ({ id }) => id !== sessionId
    ),
  })
}

export const readUserSavedSessions = async () => {
  const res = await (browser.storage.local.get(
    localStorageKeys.USER_SAVED_SESSIONS
  ) as Promise<{
    [localStorageKeys.USER_SAVED_SESSIONS]: Session[] | undefined
  }>)
  return res?.[localStorageKeys.USER_SAVED_SESSIONS] || []
}

export const saveUserSavedSession = async (session: Session) => {
  session.lastSavedDate = new Date().toJSON()
  const existingSessions = await readUserSavedSessions()
  await browser.storage.local.set({
    [localStorageKeys.USER_SAVED_SESSIONS]: [session, ...existingSessions],
  })
}

export const deleteUserSavedSession = async (sessionId: string) => {
  const existingSessions = await readUserSavedSessions()
  await browser.storage.local.set({
    [localStorageKeys.USER_SAVED_SESSIONS]: existingSessions.filter(
      ({ id }) => id !== sessionId
    ),
  })
}
