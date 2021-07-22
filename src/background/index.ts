import { readSettings } from 'src/utils/browser/storage'
import { buildVersion, buildTime } from 'src/utils/env'
import { concatTruthy } from 'src/utils/helpers'
import { log } from 'src/utils/logger'

import { setupActions } from './configuration'
import { setupListeners } from './listeners'

const logContext = 'background/index'

const main = async () => {
  log.debug(logContext, 'main')

  const settings = await readSettings()
  setupListeners(settings)
  await setupActions(settings.extensionClickAction)

  const bytesUsed = await browser.storage.sync.getBytesInUse()

  const status = [
    `loaded: ${new Date().toISOString()}`,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ...concatTruthy(buildVersion, `version: ${buildVersion!}`),
    ...concatTruthy(
      buildTime,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      `build date: ${new Date(buildTime!).toISOString()}`
    ),
    `bytes in sync storage: ${bytesUsed} B`,
  ]

  log.info(status.join('\n'))
}

void main()
