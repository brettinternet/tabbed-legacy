import { readSettings } from 'src/utils/browser/storage'
import { buildVersion, buildTime } from 'src/utils/env'
import { log } from 'src/utils/logger'

import { setupActions } from './configuration'
import { setupListeners } from './listeners'

const logContext = 'background/index'

const main = async () => {
  log.debug(logContext, 'main')
  const settings = await readSettings()

  setupListeners(settings)
  setupActions(settings.extensionClickAction)

  const bytesUsed = await browser.storage.sync.getBytesInUse()
  console.info(
    `loaded: ${new Date().toISOString()};\nversion: ${buildVersion};\nbuild date: ${new Date(
      buildTime
    ).toISOString()}\nbytes in sync storage: ${bytesUsed} B`
  )
}

main()
