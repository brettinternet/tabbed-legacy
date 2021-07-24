import {
  openExtensionPopup,
  openExtensionSidebar,
  openExtensionTab,
  openExtensionPopout,
} from 'src/utils/browser/actions'
import { popupUrl, sidebarUrl } from 'src/utils/env'
import { Settings, extensionClickActions } from 'src/utils/settings'
import { log } from 'src/utils/logger'

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
const setupMenus = (popupDisabled?: boolean) => {
  log.debug(logContext, 'setupMenus()', popupDisabled)

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
    onclick: openExtensionTab,
  })

  browser.contextMenus.create({
    title: 'Open in popout window',
    contexts: ['browser_action'],
    onclick: openExtensionPopout,
  })

  // TODO: add icon, save action
  // browser.contextMenus.create({
  //   id: 'save-session',
  //   title: 'Save session',
  //   contexts: ['all'],
  //   onclick: saveSession,
  // })
}

/**
 * Setup certain browser actions related to the browser toolbar
 */
export const setupActions = async (
  extensionClickAction: Settings['extensionClickAction']
) => {
  log.debug(logContext, 'setupActions()', extensionClickAction)

  if (extensionClickAction === extensionClickActions.TAB) {
    await disablePopup()
    browser.browserAction.onClicked.removeListener(openExtensionSidebar)
    browser.browserAction.onClicked.addListener(openExtensionTab)
  } else if (
    extensionClickAction === extensionClickActions.SIDEBAR &&
    !!browser.sidebarAction
  ) {
    await disablePopup()
    browser.browserAction.onClicked.removeListener(openExtensionTab)
    await browser.sidebarAction.setPanel({
      panel: sidebarUrl,
    })
    browser.browserAction.onClicked.addListener(openExtensionSidebar)
  } else {
    browser.browserAction.onClicked.removeListener(openExtensionSidebar)
    browser.browserAction.onClicked.removeListener(openExtensionTab)
    await enablePopup()
  }

  setupMenus(extensionClickAction !== extensionClickActions.POPUP)
}
