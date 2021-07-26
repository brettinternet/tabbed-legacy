import { popupUrl, tabUrl, popoutUrl, sidebarUrl } from 'src/utils/env'
import { log } from 'src/utils/logger'
import { concatTruthy } from 'src/utils/helpers'

const logContext = 'components/app/store'

// Feature flags
export const isPopup = window.location.href.includes(popupUrl)
export const isTab = window.location.href.includes(tabUrl)
export const isPopout = window.location.href.includes(popoutUrl)
export const isSidebar = window.location.href.includes(sidebarUrl)
export const isSidebarSupported = !!browser.sidebarAction

log.debug(
  [
    logContext,
    ...concatTruthy(isPopup, isPopup),
    ...concatTruthy(isPopout, 'isPopout'),
    ...concatTruthy(isTab, 'isTab'),
    ...concatTruthy(isSidebar, 'isSidebar'),
    ...concatTruthy(isSidebarSupported, 'isSidebarSupported'),
  ].join('\n')
)
