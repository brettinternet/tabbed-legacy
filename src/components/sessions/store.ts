import { writable } from 'svelte/store'

import type { SessionLists } from 'src/utils/browser/storage'

export const currentWindowId = writable<number | undefined>()
export const currentTabId = writable<number | undefined>()
export const sessionLists = writable<SessionLists | undefined>()
export const selectedSessionId = writable<string | undefined>()
