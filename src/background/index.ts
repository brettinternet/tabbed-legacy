import { readSettings } from 'src/utils/browser/storage'
import { buildVersion, buildTime } from 'src/utils/env'
import { concatTruthy } from 'src/utils/helpers'
import { updateLogLevel, log } from 'src/utils/logger'

import { loadExtensionActions } from './configuration'
import { setupListeners } from './listeners'

const logContext = 'background/index'

const main = async () => {
  log.debug(logContext, 'main')

  const settings = await readSettings()
  updateLogLevel(settings.debugMode)
  // "setup" fns are invoked once on background startup
  setupListeners(settings)
  // "load" fns are invoked once on background startup and
  // can be reloaded through messages from client
  await loadExtensionActions(settings.extensionClickAction)

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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ...concatTruthy(bytesUsed, `bytes in local storage: ${bytesUsed!} B`),
  ]

  log.info(status.join('\n'))
}

void main()
