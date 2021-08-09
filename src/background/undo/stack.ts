import { log } from 'src/utils/logger'

const MAX_STACK = 10

type ActionGroup = {
  undo: () => void | Promise<void>
  redo: () => void | Promise<void>
}

class Undo {
  private stack: ActionGroup[] = []
  private current = -1

  constructor() {
    log.debug('Initializing undo stack')
  }

  push = (actionGroup: ActionGroup) => {
    this.current++
    this.stack.splice(this.current) // clear stack ahead of current
    this.stack.push(actionGroup)
    if (this.stack.length > MAX_STACK) {
      this.stack.splice(0, this.stack.length - MAX_STACK)
    }
  }

  undo = async () => {
    if (this.current > -1) {
      const action = this.stack[this.current]
      await action.undo()
      this.current--
    } else {
      log.warn('No actions to undo')
    }
  }

  redo = async () => {
    const action = this.stack[++this.current]
    if (action) {
      await action.redo()
      this.current++
    } else {
      log.warn('No actions to redo')
    }
  }

  clear = () => {
    this.stack = []
    this.current = -1
  }
}

export const undoStack = new Undo()
