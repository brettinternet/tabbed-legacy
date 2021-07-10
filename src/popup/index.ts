import 'src/i18n'
import 'src/utils/tailwind.css'
import { setup } from 'src/utils/document'

import Popup from './popup.svelte'

const app = new Popup({
  target: document.body,
})

setup()

export default app
