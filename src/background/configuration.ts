import {
  openExtensionPopup,
  openExtensionSidebar,
  openExtensionTab,
  openExtensionPopout,
} from 'src/utils/browser/actions'
import { popupUrl, panelUrl } from 'src/utils/env'
import { Settings, extensionClickActions } from 'src/utils/settings'

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

  browser.contextMenus.create({
    title: 'Open in popout window',
    contexts: ['browser_action'],
    onclick: openExtensionPopout,
  })
}

/**
 * Setup certain browser actions related to the browser toolbar
 */
export const setupActions = async (
  extensionClickAction: Settings['extensionClickAction']
) => {
  // TODO: check settings for preferred default action
  if (extensionClickAction === extensionClickActions.TAB) {
    await browser.browserAction.setPopup({ popup: '' }) // remove popup
    browser.browserAction.onClicked.addListener(openExtensionTab)
  } else {
    browser.browserAction.onClicked.removeListener(openExtensionTab)
    await browser.browserAction.setPopup({ popup: popupUrl })
  }

  if (browser.sidebarAction) {
    browser.sidebarAction.setPanel({
      panel: panelUrl,
    })
  }
}
