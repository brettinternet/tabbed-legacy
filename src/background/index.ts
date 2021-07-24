import { readSettings } from 'src/utils/browser/storage'
import { buildVersion, buildTime } from 'src/utils/env'
import { concatTruthy } from 'src/utils/helpers'
import { log } from 'src/utils/logger'

import { loadActions } from './configuration'
import { setupListeners } from './listeners'

const logContext = 'background/index'

const main = async () => {
  log.debug(logContext, 'main')

  const settings = await readSettings()
  // "setup" fns are invoked on background startup
  setupListeners(settings)
  // "load" fns are invoked on background startup and can be reloaded through messages from client
  await loadActions(settings.extensionClickAction)

  const bytesUsed =
    browser.storage.local.getBytesInUse &&
    (await browser.storage.local.getBytesInUse())

  const status = [
    `loaded: ${new Date().toISOString()}`,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ...concatTruthy(buildVersion, `version: ${buildVersion!}`),
    ...concatTruthy(
      buildTime,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      `build date: ${new Date(buildTime!).toISOString()}`
    ),
    ...concatTruthy(bytesUsed, `bytes in local storage: ${bytesUsed} B`),
  ]

  log.info(status.join('\n'))
}

void main()
