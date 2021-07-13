export const isBookmarkManagerTab = (tab: browser.tabs.Tab) =>
  tab.url && tab.url.startsWith('chrome://bookmarks/')

export const isAuxiliaryTab = (tab: browser.tabs.Tab) =>
  tab.url &&
  (tab.url.startsWith('chrome:') ||
    tab.url.startsWith('chrome-devtools:') ||
    isBookmarkManagerTab(tab))

export const isNewTab = (tab: browser.tabs.Tab) =>
  /^chrome:\/\/newtab\/?$/.test(tab.url)

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

export const getWindow = (windowId: number, options: browser.windows.GetInfo) =>
  browser.windows.get(windowId, options)

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
    const index = windows.findIndex(w => isSameWindow(currentWindow, w))
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

const focusWindow = async (windowId: number) => {
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

export const openTab = async (tab: browser.tabs.Tab) => {
  const allowed = await browser.extension.isAllowedIncognitoAccess()
  if (tab.incognito && !allowed) {
    /**
     * Guide user to enable it:
     * https://stackoverflow.com/questions/17438354/how-can-i-enable-my-chrome-extension-in-incognito-mode/17443982#17443982
     */
    throw Error('No incognito access allowed')
  }

  if (tab.id) {
    await focusWindowTab(tab.windowId, tab.id)
    return await activateTab(tab.id)
  } else if (!tab.incognito && browser.extension.inIncognitoContext) {
    return await browser.windows.create(tab)
  } else {
    return await browser.tabs.create(tab)
  }
}
