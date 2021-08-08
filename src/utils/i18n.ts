import en from 'date-fns/locale/en-US'

export type Locales = 'en'

export const getDateLocale = (locale: Locales | string) => {
  if (locale.includes('en')) {
    return en
  }
}

export const locale = browser.i18n.getUILanguage()
