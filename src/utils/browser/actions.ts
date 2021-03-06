import { openTabOrFocus, openTab } from 'src/utils/browser/query'
import { tabUrl, popoutUrl } from 'src/utils/env'
import { readSettings } from './storage'

export const openExtensionPopup = () => browser.browserAction.openPopup()

export const openExtensionSidebar = async () => browser.sidebarAction.open()

export const openExtensionNewTab = async () => {
  const url = browser.runtime.getURL(tabUrl)
  await openTab({ url, incognito: browser.extension.inIncognitoContext })
}

export const openExtensionExistingTab = async () => {
  const url = browser.runtime.getURL(tabUrl)
  const incognito = browser.extension.inIncognitoContext
  await openTabOrFocus({ url }, incognito)
}

export const openExtensionPopout = async () => {
  const { popoutState } = await readSettings()

  await browser.windows.create({
    type: 'popup',
    focused: true,
    url: popoutUrl,
    ...popoutState,
  })
}
