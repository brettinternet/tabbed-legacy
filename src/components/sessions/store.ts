import { writable, get } from 'svelte/store'

import { sortWindows } from 'src/utils/browser/query'
import type { SessionLists } from 'src/utils/browser/storage'

export const currentWindowId = writable<number | undefined>()
export const currentTabId = writable<number | undefined>()
export const sessionLists = writable<SessionLists | undefined>()
export const selectedSessionId = writable<string | undefined>()

export const sortCurrentSession = async (activeWindowId?: number) => {
  const session = get(sessionLists)
  if (session) {
    const windows = await sortWindows(session.current.windows, activeWindowId)
    sessionLists.update((state) =>
      state
        ? {
            ...state,
            current: {
              ...state.current,
              windows,
            },
          }
        : undefined
    )
  }
}
