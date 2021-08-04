import { MESSAGE_TYPE_PUSH_UPDATE_SESSION_LISTS } from 'src/utils/messages'
import type { PushUpdateSessionListsMessage } from 'src/utils/messages'
import { log } from 'src/utils/logger'

const logContext = 'background/send'

export const updateSessionMessage = async (
  sessions: PushUpdateSessionListsMessage['value']
) => {
  log.debug(logContext, 'updateSessionMessage()', sessions)

  const message: PushUpdateSessionListsMessage = {
    type: MESSAGE_TYPE_PUSH_UPDATE_SESSION_LISTS,
    value: sessions,
  }
  try {
    await browser.runtime.sendMessage(message)
  } catch (_err) {
    const err = browser.runtime.lastError
    // If client is not merely closed
    // Potentially could use `runtime.connect` to determine if client is connected
    // // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/connect
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/connect
    if (
      err?.message !==
      'Could not establish connection. Receiving end does not exist.'
    ) {
      throw err
    }
  }
}