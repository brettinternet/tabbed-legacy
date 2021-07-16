import { openTab } from 'src/utils/browser/query'
import { tabUrl, popoutUrl } from 'src/utils/env'
import { readSettings } from './storage'

export const openExtensionPopup = () => browser.browserAction.openPopup()

export const openExtensionSidebar = async () => browser.sidebarAction.open()

export const openExtensionTab = async () => {
  const url = browser.runtime.getURL(tabUrl)
  await openTab({ url }, browser.extension.inIncognitoContext)
}

export const openExtensionPopout = async () => {
  const { popupDimensions } = await readSettings()

  await browser.windows.create({
    type: 'popup',
    focused: true,
    url: popoutUrl,
    height: popupDimensions.height,
    width: popupDimensions.width,
  })
}
