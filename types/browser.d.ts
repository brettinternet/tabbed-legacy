declare namespace browser.tabs {
  interface Tab {
    /**
     * Chrome specific when status === 'loading'
     *
     * @source https://developer.chrome.com/docs/extensions/reference/tabs/
     */
    pendingUrl?: string

    /**
     * value is `-1` if tab is not assigned to a group, not supported by the polyfill yet
     */
    groupId: number
  }
}

declare namespace browser.runtime {
  const getBrowserInfo: (() => Promise<browser.runtime.BrowserInfo>) | undefined
}

declare namespace browser.storage {
  interface StorageArea {
    /**
     * Deprecated in Firefox, not in Chrome
     * https://developer.chrome.com/docs/extensions/reference/storage/#type-StorageArea
     */
    getBytesInUse?:
      | ((keys?: string | string[] | undefined) => Promise<number>)
      | undefined
  }
}
