import type {
  UndoMessage,
  RedoMessage,
  CanUndoRedoMessage,
  CanUndoRedoResponse,
} from 'src/utils/messages'
import {
  MESSAGE_TYPE_UNDO,
  MESSAGE_TYPE_REDO,
  MESSAGE_TYPE_CAN_UNDO_REDO,
} from 'src/utils/messages'
import { log } from 'src/utils/logger'
import { toast } from 'src/components/toast/store'

const logContext = 'components/app/send'

export const undo = async () => {
  log.debug(logContext, 'undo()')

  const message: UndoMessage = {
    type: MESSAGE_TYPE_UNDO,
  }

  try {
    await browser.runtime.sendMessage(message)
  } catch (err) {
    const { message } = err as browser.runtime._LastError
    if (message) {
      toast.push({ message, level: 'error' })
    }
  }
}

export const redo = async () => {
  log.debug(logContext, 'redo()')

  const message: RedoMessage = {
    type: MESSAGE_TYPE_REDO,
  }

  try {
    await browser.runtime.sendMessage(message)
  } catch (err) {
    const { message } = err as browser.runtime._LastError
    if (message) {
      toast.push({ message, level: 'error' })
    }
  }
}

export const canUndoRedo = async (): Promise<CanUndoRedoResponse> => {
  log.debug(logContext, 'canUndoRedo()')

  const message: CanUndoRedoMessage = {
    type: MESSAGE_TYPE_CAN_UNDO_REDO,
  }

  try {
    return await browser.runtime.sendMessage(message)
  } catch (err) {
    log.error(logContext, 'canUndoRedo()', err)
  }

  return {
    undo: false,
    redo: false,
  }
}
