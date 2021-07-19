/* eslint-disable @typescript-eslint/unbound-method */
import { defaultSettings, Settings } from 'src/utils/settings'

import { readSettings, writeSetting, storageKeys } from './storage'

describe('utils/browser/storage.ts', () => {
  describe('readSettings', () => {
    it('returns default settings when no storage is found', async () => {
      const settings = await readSettings()
      expect(browser.storage.sync.get).toHaveBeenCalledWith(
        storageKeys.SETTINGS
      )
      expect(settings).toEqual(defaultSettings)
    })
  })

  describe('writeSetting', () => {
    it('allows for patch/partial updates', async () => {
      const newSettings: Partial<Settings> = {
        fontSize: 12,
      }

      await writeSetting(newSettings)
      expect(browser.storage.sync.set).toHaveBeenCalledWith({
        [storageKeys.SETTINGS]: {
          ...defaultSettings,
          ...newSettings,
        },
      })
    })
  })
})
