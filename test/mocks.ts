// @ts-ignore
import { browser as partialBrowser } from 'jest-webextension-mock/src/index'
import type { Logger } from 'src/utils/logger'
import { levels } from 'loglevel'

/**
 * https://github.com/clarkbw/jest-webextension-mock/blob/master/src/index.js
 */
type ExistingBrowserMock = {
  omnibox: typeof browser.omnibox
  tabs: typeof browser.tabs
  runtime: typeof browser.runtime
  storage: typeof browser.storage
  browserAction: typeof browser.browserAction
  commands: typeof browser.commands
  notifications: typeof browser.notifications
  i18n: typeof browser.i18n
  webNavigation: typeof browser.webNavigation
  extension: typeof browser.extension
  downloads: typeof browser.downloads
  geckoProfiler: typeof browser.geckoProfiler
}

type BrowserMock = {
  windows: typeof browser.windows
} & ExistingBrowserMock

/**
 * Monkey patching "jest-webextension-mock" mocks
 */
const browserMock: BrowserMock = {
  ...partialBrowser,
  tabs: {
    ...partialBrowser.tabs,
    onActivated: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
  },
  windows: {
    onFocusChanged: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
  },
}

// @ts-ignore
global.browser = browserMock

/**
 * @source https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

type LoggerModule = {
  updateLogLevel: (enable?: boolean) => void
  log: Logger
}

jest.mock(
  'src/utils/logger',
  (): LoggerModule => ({
    updateLogLevel: jest.fn(),
    log: {
      levels,
      methodFactory: jest.fn(),
      trace: jest.fn(),
      debug: jest.fn(),
      log: jest.fn(),
      info: jest.fn(),
      warn: console.warn,
      error: console.error,
      setLevel: jest.fn(),
      getLevel: jest.fn(),
      setDefaultLevel: jest.fn(),
      enableAll: jest.fn(),
      disableAll: jest.fn(),
    },
  })
)

export {}
