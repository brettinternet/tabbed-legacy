import en from 'date-fns/locale/en-US'

import { log } from 'src/utils/logger'
import { isProd } from 'src/utils/env'

const logContext = 'utils/i18n'

export type Locales = 'en'

export const getDateLocale = (locale: Locales | string) => {
  if (locale.includes('en')) {
    return en
  }
}

export const locale = browser.i18n.getUILanguage()

/**
 * Up to 9 substitutions supported in Chrome
 */
export const getMessage = (
  messageName: string,
  defaultMessage: string = messageName,
  substitutions?: any
) => {
  const message = browser.i18n.getMessage(messageName, substitutions)
  if (!isProd && !message) {
    log.warn(
      logContext,
      'getMessage()',
      'Missing i18n message name:',
      messageName
    )
  }
  return message || defaultMessage
}
