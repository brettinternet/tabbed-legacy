import type { SearchSessionsMessage } from 'src/utils/messages'
import { MESSAGE_TYPE_SEARCH_SESSIONS } from 'src/utils/messages'
import { search } from './search'

export const setupSearchListeners = () => {
  browser.runtime.onMessage.addListener((message: SearchSessionsMessage) => {
    if (message.type === MESSAGE_TYPE_SEARCH_SESSIONS) {
      return search(message.value.text)
    }

    return false
  })
}
