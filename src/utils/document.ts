import { buildTime, buildVersion } from './env'

/**
 * Setup document attributes
 */
export const setup = (): void => {
  if (typeof window !== 'undefined') {
    if (buildTime) {
      document.documentElement.setAttribute(
        'data-time',
        new Date(buildTime).toISOString()
      )
    }
    if (buildVersion) {
      document.documentElement.setAttribute('data-version', buildVersion)
    }
  }
}
