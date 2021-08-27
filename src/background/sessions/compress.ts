import { pick } from 'lodash'

import type { Session } from 'src/utils/browser/storage'
import { getTabUrl } from 'src/utils/browser/query'
import { log } from 'src/utils/logger'

const logContext = 'background/sessions/compress'

const compressTab = (tab: browser.tabs.Tab) => {
  const tabPicks: Array<keyof browser.tabs.Tab> = [
    'active',
    'title',
    'groupId',
    'index',
    'highlighted',
    'pinned',
    'incognito',
    'windowId',
    'id',
    'favIconUrl',
  ]
  const compressedTab = pick(tab, tabPicks)
  compressedTab.url = getTabUrl(tab)
  return compressedTab
}

export const compressWindow = (win: browser.windows.Window) => {
  const winPicks: Array<keyof browser.windows.Window> = [
    'id',
    'tabs',
    'focused',
    'incognito',
    'alwaysOnTop',
    'incognito',
    'state',
  ]
  const compressedWin = pick(win, winPicks)
  compressedWin.tabs = win.tabs?.map(compressTab)
  return compressedWin
}

export const compressSession = (session: Session) => {
  log.debug(logContext, 'compressSession()')

  const sessionPicks: Array<keyof Session> = [
    'id',
    'title',
    'windows',
    'createdDate',
    'lastModifiedDate',
    'userSavedDate',
    'type',
  ]
  const compressedSession = pick(session, sessionPicks)
  compressedSession.windows = session.windows.map(compressWindow)
  return compressedSession
}
