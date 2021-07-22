import { log } from 'src/utils/logger'
import type { Session } from 'src/utils/browser/storage'

export const browsers = {
  CHROME: 'chrome',
  FIREFOX: 'firefox',
}

export const getBrowser = async () => {
  if (window.chrome?.app) {
    return browsers.CHROME
  }

  /**
   * Only available on Firefox
   * @source https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/getBrowserInfo
   */
  if (!!browser.runtime.getBrowserInfo) {
    return browsers.FIREFOX
  }
}

/**
 * See `browser.d.ts` for information on `pendingUrl`
 */
export const getTabUrl = (tab: browser.tabs.Tab) => tab.pendingUrl || tab.url

export const isBookmarkManagerTab = (tab: browser.tabs.Tab) =>
  tab.url && tab.url.startsWith('chrome://bookmarks/')

export const isAuxiliaryTab = (tab: browser.tabs.Tab) =>
  tab.url &&
  (tab.url.startsWith('chrome:') ||
    tab.url.startsWith('chrome-devtools:') ||
    isBookmarkManagerTab(tab))

export const isNewTab = (tab: browser.tabs.Tab) => {
  // Chrome
  const url = getTabUrl(tab)
  if (url && /^chrome:\/\/newtab\/?$/.test(url)) {
    return true
  }

  // Firefox
  // Firefox tabs have a `about:blank` url when status === 'loading'
  if (
    (url === 'about:blank' || url === 'about:newtab') &&
    tab?.status === 'complete' &&
    tab?.title === 'New Tab'
  ) {
    return true
  }

  return false
}

/**
 * Tab.id is an optional field, so compare other fields for a better estimation
 * @docs https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/Tab
 */
export const isSameTab = (tab1: browser.tabs.Tab, tab2: browser.tabs.Tab) =>
  tab1.id === tab2.id &&
  tab1.windowId === tab2.windowId &&
  tab1.url === tab2.url &&
  tab1.title === tab2.title &&
  (tab1.highlighted === tab2.highlighted || tab1.active === tab2.active) &&
  tab1.pinned === tab2.pinned &&
  tab1.incognito === tab2.incognito

/**
 * Window.id is an optional field, so compare other fields for a better estimation
 * @docs https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/Window
 */
export const isSameWindow = (
  window1: browser.windows.Window,
  window2: browser.windows.Window
) =>
  window1.id === window2.id &&
  window1.focused === window2.focused &&
  window1.incognito === window2.incognito

export const getWindow = (
  windowId: number,
  options: browser.windows.GetInfo = {}
) => browser.windows.get(windowId, options)

export const getActiveTabId = async (
  windowId: number
): Promise<number | undefined> => {
  if (windowId > 0) {
    const tabs = await browser.tabs.query({ active: true, windowId })
    return tabs.find(({ active }) => active)?.id
  }
}

/**
 * @docs https://developer.chrome.com/docs/extensions/reference/i18n/#overview-predefined
 */
export const getExtensionId = () => browser.i18n.getMessage('@@extension_id')

export const getWindowAndTabs = (windowId: number) =>
  browser.windows.get(windowId, { populate: true })

/**
 * Get windows, optionally order the current window first
 */
export const getAllWindows = async (
  options?: browser.windows._GetAllGetInfo,
  sorted?: boolean
) => {
  const windows = await browser.windows.getAll(options)
  if (sorted) {
    const currentWindow = await getCurrentWindow(options)
    const index = windows.findIndex((w) => isSameWindow(currentWindow, w))
    windows.splice(index, 1)
    windows.unshift(currentWindow)
  }
  return windows
}

export const getCurrentWindow = (options?: browser.windows.GetInfo) =>
  browser.windows.getCurrent(options)

export const getTab = (tabId: number) => browser.tabs.get(tabId)

export const closeTab = (tabIds: number | number[]) =>
  browser.tabs.remove(tabIds)

export const closeWindow = (windowId: number) =>
  browser.windows.remove(windowId)

export const focusWindow = async (windowId: number) => {
  await browser.windows.update(windowId, {
    focused: true,
  })
}

const activateTab = async (tabId: number) => {
  await browser.tabs.update(tabId, {
    active: true,
  })
}

export const focusWindowTab = async (windowId: number, tabId: number) => {
  const currentWindow = await getCurrentWindow()
  if (windowId !== currentWindow.id) {
    await focusWindow(windowId)
  }
  await activateTab(tabId)
}

/**
 * Find existing tab with matching query, otherwise
 * open with matching incognito state
 */
export const openTab = async (
  query: browser.tabs._QueryQueryInfo,
  incognito = false
) => {
  const url = Array.isArray(query.url) ? query.url[0] : query.url
  // hashes cause queries to return empty
  const hashIndex = url?.indexOf('#') ?? -1
  query.url = url && hashIndex > -1 ? url.substr(0, hashIndex) : url

  let tab: browser.tabs.Tab | undefined
  try {
    const matches = await browser.tabs.query(query)
    if (matches.length >= 1) {
      tab = matches[0]
    }
  } catch (err) {
    log.error(err)
  }

  const allowed = await browser.extension.isAllowedIncognitoAccess()
  if (incognito && !allowed) {
    /**
     * Guide user to enable it:
     * https://stackoverflow.com/questions/17438354/how-can-i-enable-my-chrome-extension-in-incognito-mode/17443982#17443982
     */
    throw Error('No incognito access allowed')
  }

  if (tab?.id && tab?.windowId) {
    await focusWindowTab(tab.windowId, tab.id)
  } else if (
    (!incognito && browser.extension.inIncognitoContext) ||
    (incognito && !browser.extension.inIncognitoContext)
  ) {
    await browser.windows.create({ ...tab, incognito })
  } else {
    await browser.tabs.create(tab || { url })
  }
}

const openTabs = async (tabs: browser.tabs.Tab[], windowId?: number) => {
  const tasks = tabs
    .sort((a, b) => a.index - b.index)
    .map(async (tab) => {
      const { url, pinned, index, active } = tab
      /**
       * some fields such as `discarded` and reader mode ought to be supported,
       * but throw an error in Chrome in spite of the polyfill
       */
      return await browser.tabs.create({
        url,
        pinned,
        index,
        active,
        windowId,
      })
    })
  await Promise.all(tasks)
}

// TODO: Add find option to optionally search by ID
export const openWindow = async (w: browser.windows.Window) => {
  const options: browser.windows._CreateCreateData = {
    state: w.state,
  }
  switch (w.state) {
    case 'normal':
      options.height = w.height
      options.width = w.width
      break
    case 'minimized':
      break
    case 'maximized':
      options.top = w.top
      options.left = w.left
      break
  }

  const firstTab = w.tabs?.[0]
  const createdWindow = await browser.windows.create({
    incognito: firstTab?.incognito,
    ...options,
  })

  if (w.tabs && createdWindow.id) {
    const emptyStartupTabIds = createdWindow.tabs?.map(({ id }) => id) || []
    await openTabs(w.tabs, createdWindow.id)
    const newWindow = await getWindow(createdWindow.id, { populate: true })
    const tabsToClose = newWindow.tabs?.filter(({ id }) =>
      emptyStartupTabIds.includes(id)
    )
    const closeTabs = tabsToClose?.map(async (tab) => {
      if (tab.id) {
        return await closeTab(tab.id)
      }
    })
    if (closeTabs) {
      await Promise.all(closeTabs)
    }
  }
}

export const openWindows = async (windows: browser.windows.Window[]) => {
  const tasks = windows.map(openWindow)
  await Promise.all(tasks)
}
