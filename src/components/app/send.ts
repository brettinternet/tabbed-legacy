import type {
  SearchSessionsMessage,
  SearchSessionsResponse,
} from 'src/utils/messages'
import { MESSAGE_TYPE_SEARCH_SESSIONS } from 'src/utils/messages'
import { log } from 'src/utils/logger'

const logContext = 'components/app/send'

export const searchSessions = async (
  text: string
): Promise<SearchSessionsResponse> => {
  log.debug(logContext, 'searchSessions()', text)

  const message: SearchSessionsMessage = {
    type: MESSAGE_TYPE_SEARCH_SESSIONS,
    value: { text },
  }
  return await browser.runtime.sendMessage(message)
}
