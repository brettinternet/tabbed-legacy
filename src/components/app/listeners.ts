import type { UpdatePopoutPositionMessage } from 'src/utils/messages'
import { isPopout } from 'src/components/app/store'
import { MESSAGE_TYPE_UPDATE_POPOUT_POSITION } from 'src/utils/messages'
import { focusRingEnabled } from 'src/components/focus/context'

export const setupListeners = () => {
  if (isPopout) {
    window.addEventListener('beforeunload', () => {
      const message: UpdatePopoutPositionMessage = {
        type: MESSAGE_TYPE_UPDATE_POPOUT_POSITION,
        value: {
          top: window.screenTop,
          left: window.screenLeft,
          height: window.outerHeight,
          width: window.outerWidth,
        },
      }
      void browser.runtime.sendMessage(message)
    })
  }

  document.addEventListener('mousedown', () => {
    focusRingEnabled.set(false)
  })
}
