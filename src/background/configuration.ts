import {
  openExtensionPopup,
  openExtensionSidebar,
  openExtensionTab,
  openExtensionPopout,
} from 'src/utils/browser/actions'
import { popupUrl, panelUrl } from 'src/utils/env'
import { Settings, extensionClickActions } from 'src/utils/settings'
import { log } from 'src/utils/logger'

const logContext = 'background/configuration'

const enablePopup = async () => {
  log.debug(logContext, 'enablePopup')
  await browser.browserAction.setPopup({ popup: popupUrl })
}

const disablePopup = async () => {
  log.debug(logContext, 'disablePopup')
  await browser.browserAction.setPopup({ popup: '' })
}

/**
 * Setup browser toolbar context menus
 */
const setupMenus = (prefersTab?: boolean) => {
  log.debug(logContext, 'setupMenus')
  if (browser.browserAction.openPopup) {
    browser.contextMenus.create({
      title: 'Open popup',
      contexts: ['browser_action'],
      onclick: async () => {
        if (prefersTab) {
          await enablePopup()
          await openExtensionPopup()
          disablePopup()
        } else {
          openExtensionPopup()
        }
      },
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
  log.debug(logContext, 'setupActions')
  const prefersTab = extensionClickAction === extensionClickActions.TAB

  if (prefersTab) {
    await disablePopup()
    browser.browserAction.onClicked.addListener(openExtensionTab)
  } else {
    browser.browserAction.onClicked.removeListener(openExtensionTab)
    await enablePopup()
  }

  setupMenus(prefersTab)

  if (browser.sidebarAction) {
    browser.sidebarAction.setPanel({
      panel: panelUrl,
    })
  }
}
