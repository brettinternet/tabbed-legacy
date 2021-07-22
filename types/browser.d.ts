declare namespace browser.tabs {
  interface Tab {
    /**
     * Chrome specific when status === 'loading'
     *
     * @source https://developer.chrome.com/docs/extensions/reference/tabs/
     */
    pendingUrl?: string
  }
}

declare namespace browser.runtime {
  const getBrowserInfo: (() => Promise<browser.runtime.BrowserInfo>) | undefined
}
