import { buildVersion, buildTime } from 'src/utils/env'

console.info(
  `loaded: ${new Date().toISOString()}; version: ${buildVersion}; build date: ${buildTime}`
)
