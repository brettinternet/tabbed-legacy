import { log } from 'src/utils/logger'
import { MESSAGE_TYPE_IMPORT_SESSIONS_FROM_TEXT } from 'src/utils/messages'
import type { ImportSessionsFromTextMessage } from 'src/utils/messages'

const logContext = 'components/import/store'

export const importSessionsFromText = async (content: string) => {
  log.debug(logContext, 'importSessionsFromText()', content)

  const message: ImportSessionsFromTextMessage = {
    type: MESSAGE_TYPE_IMPORT_SESSIONS_FROM_TEXT,
    value: { content },
  }
  await browser.runtime.sendMessage(message)
}
