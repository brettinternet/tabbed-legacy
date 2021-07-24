import { isProd } from 'src/utils/env'
import type { Valueof } from 'src/utils/helpers'

export const layouts = {
  LIST: 'list',
  GRID: 'grid',
}
export type Layout = Valueof<typeof layouts>

export const extensionClickActions = {
  TAB: 'tab',
  POPUP: 'popup',
  SIDEBAR: 'sidebar',
}
export type ExtensionClickAction = Valueof<typeof extensionClickActions>

export const themes = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
}
export type Theme = Valueof<typeof themes>

export type Settings = {
  layout: Layout
  extensionClickAction: ExtensionClickAction
  showTabCountBadge: boolean
  shortcuts: boolean
  fontSize: number
  popupDimensions: {
    width: number
    height: number
  }
  theme: Theme
  debugMode: boolean
  saveClosedWindows: boolean
  sortActiveWindowFirst: boolean
}

export const defaultSettings: Settings = {
  layout: layouts.LIST,
  extensionClickAction: extensionClickActions.POPUP,
  showTabCountBadge: true,
  shortcuts: true,
  fontSize: 16,
  popupDimensions: {
    width: 600,
    height: 600,
  },
  theme: themes.LIGHT,
  debugMode: !isProd,
  saveClosedWindows: false,
  sortActiveWindowFirst: false,
}
