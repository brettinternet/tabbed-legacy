/**
 * @docs https://github.com/kaisermann/svelte-i18n/blob/main/docs/Getting%20Started.md
 */
import { register, init, getLocaleFromNavigator } from 'svelte-i18n'

register('en', () => import('./en.json'))

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator(),
})
