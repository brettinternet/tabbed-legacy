/**
 * @docs https://github.com/kaisermann/svelte-i18n/blob/main/docs/Getting%20Started.md
 */
import { register, init, getLocaleFromNavigator } from 'svelte-i18n'
import en from 'date-fns/locale/en-US'

export type Locales = 'en'

export const setup = () => {
  register('en', () => import('./en.json'))

  init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator(),
  })
}

export const getDateLocale = (locale: Locales | string) => {
  if (locale.includes('en')) {
    return en
  }
}
