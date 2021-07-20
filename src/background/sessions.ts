import { v4 as uuidv4 } from 'uuid';

import { getAllWindows } from 'src/utils/browser/query'
import type { SessionLists, Session } from 'src/utils/browser/storage'
import { log } from 'src/utils/logger'

const logContext = 'background/sessions'

const getCurrentSession = async (): Promise<Session> => {
  log.debug(logContext, 'getCurrentSession')

  const windows = await getAllWindows({ populate: true }, true)
  return {
    id: uuidv4(),
    lastModified: new Date().getTime(),
    windows,
    current: true,
  }
}

export const getSessions = async (isUpdate?: boolean): Promise<SessionLists> => {
  log.debug(logContext, 'getSessions', isUpdate)

  return {
    current: await getCurrentSession(),
    previous: [],
    saved: [],
  }
}
