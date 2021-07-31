import { writable, get } from 'svelte/store'

import { log } from 'src/utils/logger'
import { sortWindows } from 'src/utils/browser/query'
import { getSessionLists } from 'src/components/sessions/send'
import type { SessionLists, Session } from 'src/utils/browser/storage'

const logContext = 'components/sessions/store'

export const currentWindowId = writable<number | undefined>()
export const currentTabId = writable<number | undefined>()
export const sessionLists = writable<SessionLists | undefined>()
export const selectedSessionId = writable<string | undefined>()
export const editSession = writable<Session | undefined>()

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

export const forceUpdateSessions = async () => {
  log.debug(logContext, 'forceUpdateSessions()')

  sessionLists.set(await getSessionLists())
}
