import { writable, get } from 'svelte/store'

import type { SessionLists, Session } from 'src/utils/browser/storage'
import { log } from 'src/utils/logger'
import { sortWindows } from 'src/utils/browser/query'
import { getSessionLists } from 'src/components/sessions/send'
import { toast } from 'src/components/toast/store'

const logContext = 'components/sessions/store'

export const activeWindowId = writable<number | undefined>()
export const activeTabId = writable<number | undefined>()
export const sessionLists = writable<SessionLists | undefined>()
export const selectedSessionId = writable<string | undefined>()
export const editSession = writable<Session | undefined>()

export type Duplicates = {
  urls: string[]
  sessionId: string
}
export const duplicates = writable<Duplicates | undefined>()

export const sortCurrentSession = async (activeWindowId?: number) => {
  const session = get(sessionLists)
  if (session) {
    try {
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
    } catch (error) {
      log.error(error)
      const { message } = error as browser.runtime._LastError
      if (message) {
        toast.push({ message, level: 'error' })
      }
    }
  }
}

export const forceUpdateSessions = async () => {
  log.debug(logContext, 'forceUpdateSessions()')

  sessionLists.set(await getSessionLists())
}
