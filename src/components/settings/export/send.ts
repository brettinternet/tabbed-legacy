import { log } from 'src/utils/logger'
import type {
  GetAllSessionsMessage,
  GetAllSessionsResponse,
} from 'src/utils/messages'
import { MESSAGE_TYPE_GET_ALL_SESSIONS } from 'src/utils/messages'

const logContext = 'components/settings/handlers'

export const getAllSessions = async (): Promise<GetAllSessionsResponse> => {
  log.debug(logContext, 'getAllSessions()')

  const message: GetAllSessionsMessage = {
    type: MESSAGE_TYPE_GET_ALL_SESSIONS,
  }
  return await browser.runtime.sendMessage(message)
}
