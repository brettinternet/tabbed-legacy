import { writable } from 'svelte/store'

export type Session = {
  id: string
  title?: string
  lastModified: number
  windowCount?: number
  tabCount?: number
  windows: browser.windows.Window[]
  current?: boolean
}

export const currentWindowId = writable<number>()
export const currentTabId = writable<number>()
export const currentSession = writable<Session>()
export const selectedSessionId = writable<string>()
