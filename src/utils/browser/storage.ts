// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/set
import type { Settings } from 'src/utils/settings'
import { defaultSettings } from 'src/utils/settings'

export const storageKeys = {
  SETTINGS: 'settings',
}

export const readSettings = async (): Promise<Settings> => {
  const { settings = {} } = await browser.storage.sync.get(storageKeys.SETTINGS)
  const settingsWithDefaults = {
    ...defaultSettings,
    ...settings,
  }
  return settingsWithDefaults
}

export const writeSetting = async (settings: Partial<Settings>) => {
  const currentSettings = await readSettings()
  await browser.storage.sync.set({
    [storageKeys.SETTINGS]: Object.assign({}, currentSettings, settings)
  })
}
