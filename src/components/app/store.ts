import { writable } from 'svelte/store'

import { popupUrl, tabUrl, popoutUrl } from 'src/utils/env'
import { log } from 'src/utils/logger'

const logContext = 'components/app/store'

export const showSettings = writable(false)
export const showShortcuts = writable(false)

// Feature flags
export const isPopout = window.location.href.includes(popoutUrl)
export const isTab = window.location.href.includes(tabUrl)
export const isPopup = window.location.href.includes(popupUrl)
export const isSidebarSupported = !!browser.sidebarAction

log.debug(
  logContext,
  `isPopout: ${isPopout}`,
  `isTab: ${isTab}`,
  `isPopup: ${isPopup}`,
  `isSidebarSupported: ${isSidebarSupported}`
)
