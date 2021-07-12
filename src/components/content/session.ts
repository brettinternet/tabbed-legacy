export type Session = {
  id: string
  title?: string
  lastModified: number
  windowCount?: number
  tabCount?: number
  windows: browser.windows.Window[]
  current?: boolean
}
