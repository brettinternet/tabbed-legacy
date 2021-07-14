import {
  openExtensionPopup,
  openExtensionSidebar,
  openExtensionTab,
} from 'src/utils/browser/actions'
import { popupUrl } from 'src/utils/env'

/**
 * Setup browser toolbar context menus
 */
export const setupMenus = () => {
  if (browser.browserAction.openPopup) {
    browser.contextMenus.create({
      title: 'Open popup',
      contexts: ['browser_action'],
      onclick: openExtensionPopup,
    })
  }

  if (browser.sidebarAction) {
    browser.contextMenus.create({
      title: 'Open sidebar',
      contexts: ['browser_action'],
      onclick: openExtensionSidebar,
    })
  }

  browser.contextMenus.create({
    title: 'Open in tab',
    contexts: ['browser_action'],
    onclick: openExtensionTab,
  })
}

/**
 * Setup certain browser actions related to the browser toolbar
 */
export const setupActions = async () => {
  // TODO: check settings for preferred default action
  const openAsPopup = true
  if (openAsPopup) {
    browser.browserAction.onClicked.removeListener(openExtensionTab)
    await browser.browserAction.setPopup({ popup: popupUrl })
  } else {
    await browser.browserAction.setPopup({ popup: '' }) // remove popup
    browser.browserAction.onClicked.addListener(openExtensionTab)
  }

  if (browser.sidebarAction) {
    browser.sidebarAction.setPanel({
      panel: popupUrl,
    })
  }
}
