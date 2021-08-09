import { onMount, onDestroy } from 'svelte'

import type { ToastMessage } from 'src/utils/messages'
import { MESSAGE_TYPE_TOAST } from 'src/utils/messages'
import { log } from 'src/utils/logger'
import { toast } from 'src/components/toast/store'

const logContext = 'components/toast/listeners'

const toastRequest = (message: ToastMessage) => {
  if (message.type === MESSAGE_TYPE_TOAST) {
    log.debug(logContext, 'toastRequest()', message.value)

    toast.push(message.value)
  }

  return false
}

export const setupListeners = () => {
  onMount(() => {
    browser.runtime.onMessage.addListener(toastRequest)
  })

  onDestroy(() => {
    browser.runtime.onMessage.removeListener(toastRequest)
  })
}
