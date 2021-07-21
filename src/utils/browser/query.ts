import type { Session } from 'src/utils/browser/storage'

export const isBookmarkManagerTab = (tab: browser.tabs.Tab) =>
  tab.url && tab.url.startsWith('chrome://bookmarks/')

export const isAuxiliaryTab = (tab: browser.tabs.Tab) =>
  tab.url &&
  (tab.url.startsWith('chrome:') ||
    tab.url.startsWith('chrome-devtools:') ||
    isBookmarkManagerTab(tab))

export const isNewTab = (tab: browser.tabs.Tab) =>
  tab?.url && /^chrome:\/\/newtab\/?$/.test(tab.url)

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

export const openTab = async (
  query: browser.tabs._QueryQueryInfo,
  incognito = false
) => {
  let tab: browser.tabs.Tab | undefined
  const matches = await browser.tabs.query(query)
  if (matches.length === 1) {
    tab = matches[0]
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
    const url = Array.isArray(query.url) ? query.url[0] : query.url
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

export const openSession = async (session: Session) => {
  const tasks = session.windows.map(async (w) => {
    // promise.all resolve?
    const firstTab = w.tabs?.[0]

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

    const createdWindow = await browser.windows.create({
      incognito: firstTab?.incognito,
      ...options,
    })

    if (w.tabs && createdWindow.id) {
      await openTabs(w.tabs, createdWindow.id)
      const startupTabIds = createdWindow.tabs?.map(({ id }) => id) || []
      const newWindow = await getWindow(createdWindow.id, { populate: true }) // race condition with promises.....
      console.log('newWindow: ', newWindow)
      // const tabsToClose = newWindow.tabs?.filter(({ id }) => startupTabIds.includes(id))
      const tabsToClose = newWindow.tabs?.filter((tab) => isNewTab(tab))
      console.log('tabsToClose: ', tabsToClose)
      const closeTabs = tabsToClose?.map(async (tab) => {
        if (tab.id) {
          return await closeTab(tab.id)
        }
      })
      console.log('closeTabs: ', closeTabs)
      if (closeTabs) {
        const result = await Promise.all(closeTabs)
        console.log('result: ', result)
      }
    }
  })

  console.log('tasks: ', tasks)
  await Promise.all(tasks)
}
