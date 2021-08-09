import type { UndoMessage, RedoMessage } from 'src/utils/messages'
import { MESSAGE_TYPE_UNDO, MESSAGE_TYPE_REDO } from 'src/utils/messages'
import { undoStack } from './stack'

export const setupSearchListeners = () => {
  browser.runtime.onMessage.addListener((message: UndoMessage) => {
    if (message.type === MESSAGE_TYPE_UNDO) {
      return undoStack.undo()
    }

    return false
  })

  browser.runtime.onMessage.addListener((message: RedoMessage) => {
    if (message.type === MESSAGE_TYPE_REDO) {
      return undoStack.redo()
    }

    return false
  })
}
