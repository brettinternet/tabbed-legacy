export type Layout = 'list' | 'grid'
export const layouts: { [key: string]: Layout } = {
  LIST: 'list',
  GRID: 'grid',
}

export type ExtensionClickAction = 'tab' | 'popup'
export const extensionClickActions: { [key: string]: ExtensionClickAction } = {
  TAB: 'tab',
  POPUP: 'popup',
}

export type Theme = 'dark' | 'light' | 'system'
export const themes: { [key: string]: Theme } = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
}

export type Setting =
  | 'layout'
  | 'extensionClickAction'
  | 'showTabCountBadge'
  | 'shortcuts'
  | 'fontSize'
  | 'popupDimensions'
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
}
