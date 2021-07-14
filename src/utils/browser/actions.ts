import { openTab } from 'src/utils/browser/query'
import { popupUrl } from 'src/utils/env'

export const openExtensionPopup = () => browser.browserAction.openPopup()

export const openExtensionSidebar = async () => browser.sidebarAction.open()

export const openExtensionTab = async () => {
  const url = browser.runtime.getURL(popupUrl)
  await openTab({ url }, browser.extension.inIncognitoContext)
}
