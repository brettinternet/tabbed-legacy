import { buildVersion, buildTime } from 'src/utils/env'

import { setupMenus, setupActions } from './configuration'
import { setupListeners } from './listeners'

setupActions()
setupListeners()
setupMenus()

console.info(
  `loaded: ${new Date().toISOString()};\nversion: ${buildVersion};\nbuild date: ${new Date(
    buildTime
  ).toISOString()}`
)
