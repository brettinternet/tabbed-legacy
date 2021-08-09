import {
  MESSAGE_TYPE_PUSH_UPDATE_SESSION_LISTS,
  MESSAGE_TYPE_TOAST,
} from 'src/utils/messages'
import type {
  PushUpdateSessionListsMessage,
  ToastMessage,
} from 'src/utils/messages'
import { log } from 'src/utils/logger'

const logContext = 'background/send'

const handleError = (error: unknown) => {
  const err = error as browser.runtime._LastError | undefined
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
  } catch (err) {
    handleError(err)
  }
}

export const toast = async (value: ToastMessage['value']) => {
  log.debug(logContext, 'toast()', value)

  const message: ToastMessage = {
    type: MESSAGE_TYPE_TOAST,
    value,
  }
  try {
    await browser.runtime.sendMessage(message)
  } catch (err) {
    handleError(err)
  }
}
