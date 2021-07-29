import { isPopout } from 'src/components/app/store'
import { MESSAGE_TYPE_UPDATE_POPOUT_POSITION } from 'src/utils/messages'
import type { UpdatePopoutPositionMessage } from 'src/utils/messages'

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
