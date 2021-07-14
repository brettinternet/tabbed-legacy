import { buildVersion, buildTime } from 'src/utils/env'

import { setupMenus, setupActions } from './configuration'
setupActions()
setupMenus()
console.info(
  `loaded: ${new Date().toISOString()}; version: ${buildVersion}; build date: ${buildTime}`
)
