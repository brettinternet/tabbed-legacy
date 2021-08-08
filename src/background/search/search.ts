import Fuse from 'fuse.js'

import type { Session } from 'src/utils/browser/storage'
import { getAllSessions } from 'src/background/sessions/query'

let fuse: Fuse<Session>

const setup = async () => {
  const list = await getAllSessions()

  const options: Fuse.IFuseOptions<Session> = {
    keys: [
      'title',
      'windows.tabs.url',
      'windows.tabs.pendingUrl',
      'windows.tabs.title',
    ],
  }

  fuse = new Fuse(list, options)
}

void setup()

const updateCollection = async () => {
  const list = await getAllSessions()
  fuse.setCollection(list)
}

export const search = async (text: string) => {
  await updateCollection()
  return fuse.search(text)
}

export type SearchResults = Fuse.FuseResult<Session>[]
