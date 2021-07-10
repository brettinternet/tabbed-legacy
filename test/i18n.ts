import { addMessages, init } from 'svelte-i18n'

import en from 'src/i18n/en.json'

addMessages('en', en)

init({
  fallbackLocale: 'en',
  initialLocale: 'en',
})
