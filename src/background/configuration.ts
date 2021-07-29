import {
  openExtensionPopup,
  openExtensionSidebar,
  openExtensionNewTab,
  openExtensionExistingTab,
  openExtensionPopout,
} from 'src/utils/browser/actions'
import { popupUrl, sidebarUrl } from 'src/utils/env'
import { Settings, extensionClickActions } from 'src/utils/settings'
import { log } from 'src/utils/logger'
import { saveCurrentSession } from 'src/background/sessions'

const logContext = 'background/configuration'

const enablePopup = async () => {
  log.debug(logContext, 'enablePopup()')
  await browser.browserAction.setPopup({ popup: popupUrl })
}

const disablePopup = async () => {
  log.debug(logContext, 'disablePopup()')
  await browser.browserAction.setPopup({ popup: '' })
}

/**
 * Setup browser toolbar context menus
 */
const setupMenus = async (popupDisabled?: boolean) => {
  log.debug(logContext, 'setupMenus()', popupDisabled)

  // reset to avoid duplicates
  await browser.contextMenus.removeAll()

  browser.contextMenus.create({
    title: 'Open popup',
    contexts: ['browser_action'],
    onclick: async () => {
      if (popupDisabled) {
        await enablePopup()
        await openExtensionPopup()
        await disablePopup()
      } else {
        await openExtensionPopup()
      }
    },
  })

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
    onclick: openExtensionNewTab,
  })

  browser.contextMenus.create({
    title: 'Open in popout window',
    contexts: ['browser_action'],
    onclick: openExtensionPopout,
  })

  browser.contextMenus.create({
    id: 'save-session',
    title: 'Save session',
    contexts: ['page'],
    onclick: async () => {
      try {
        await saveCurrentSession()
        await browser.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon-32x32.png',
          title: 'Session saved',
          message: 'The current session has been saved',
        })
      } catch (err) {
        log.error(err)
      }
    },
  })
}

/**
 * Setup certain browser actions related to the browser toolbar
 */
export const loadActions = async (
  extensionClickAction: Settings['extensionClickAction']
) => {
  log.debug(logContext, 'loadActions()', extensionClickAction)

  if (extensionClickAction === extensionClickActions.TAB) {
    await disablePopup()
    browser.browserAction.onClicked.removeListener(openExtensionSidebar)
    browser.browserAction.onClicked.addListener(openExtensionExistingTab)
  } else if (
    extensionClickAction === extensionClickActions.SIDEBAR &&
    !!browser.sidebarAction
  ) {
    await disablePopup()
    browser.browserAction.onClicked.removeListener(openExtensionExistingTab)
    await browser.sidebarAction.setPanel({
      panel: sidebarUrl,
    })
    browser.browserAction.onClicked.addListener(openExtensionSidebar)
  } else {
    browser.browserAction.onClicked.removeListener(openExtensionSidebar)
    browser.browserAction.onClicked.removeListener(openExtensionExistingTab)
    await enablePopup()
  }

  await setupMenus(extensionClickAction !== extensionClickActions.POPUP)
}
