import type {
  UndoMessage,
  RedoMessage,
  CanUndoRedoMessage,
} from 'src/utils/messages'
import {
  MESSAGE_TYPE_UNDO,
  MESSAGE_TYPE_REDO,
  MESSAGE_TYPE_CAN_UNDO_REDO,
} from 'src/utils/messages'
import { undoStack } from './stack'

export const setupUndoListeners = () => {
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

  browser.runtime.onMessage.addListener((message: CanUndoRedoMessage) => {
    if (message.type === MESSAGE_TYPE_CAN_UNDO_REDO) {
      return Promise.resolve({
        undo: undoStack.canUndo(),
        redo: undoStack.canRedo(),
      })
    }

    return false
  })
}
