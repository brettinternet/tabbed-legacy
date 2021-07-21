// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/set
import type { Settings } from 'src/utils/settings'
import { defaultSettings } from 'src/utils/settings'

export const localStorageKeys = {
  SETTINGS: 'settings',
  PREVIOUS_SESSIONS: 'previous_sessions',
  CURRENT_SESSION: 'current_session',
} as const

export const readSettings = async (): Promise<Settings> => {
  const { settings } = await (browser.storage.sync.get(
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
  await browser.storage.sync.set({
    [localStorageKeys.SETTINGS]: Object.assign({}, currentSettings, settings),
  })
}

export type Session = {
  id: string
  title?: string
  lastModifiedDate: string
  windowCount?: number
  tabCount?: number
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
