import { MESSAGE_TYPE_UPDATE_SESSIONS_LIST } from 'src/utils/messages'
import type { UpdateSessionsListMessage } from 'src/utils/messages'
import { log } from 'src/utils/logger'

const logContext = 'background/message-emitters'

export const updateSessionMessage = async (
  sessions: UpdateSessionsListMessage['value']
) => {
  log.debug(logContext, 'updateSessionMessage()', sessions)

  const message: UpdateSessionsListMessage = {
    type: MESSAGE_TYPE_UPDATE_SESSIONS_LIST,
    value: sessions,
  }
  try {
    await browser.runtime.sendMessage(message)
  } catch (_err) {
    const err = browser.runtime.lastError
    // If client is not merely closed
    if (
      err?.message !==
      'Could not establish connection. Receiving end does not exist.'
    ) {
      throw err
    }
  }
}
