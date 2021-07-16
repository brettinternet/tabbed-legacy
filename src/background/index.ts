import { readSettings } from 'src/utils/browser/storage'
import { buildVersion, buildTime } from 'src/utils/env'

import { setupMenus, setupActions } from './configuration'
import { setupListeners } from './listeners'

const setup = async () => {
  const settings = await readSettings()

  setupActions(settings.extensionClickAction)
  setupListeners(settings)
  setupMenus()

  const bytesUsed = await browser.storage.sync.getBytesInUse()
  console.info(
    `loaded: ${new Date().toISOString()};\nversion: ${buildVersion};\nbuild date: ${new Date(
      buildTime
    ).toISOString()}\nbytes in sync storage: ${bytesUsed} B`
  )
}

setup()
