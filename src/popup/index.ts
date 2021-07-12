import 'src/utils/tailwind.css'
import { setup as setupI18n } from 'src/i18n'
import { setup as setupDocument } from 'src/utils/document'
import App from 'src/components/app/app.svelte'

setupI18n()

const app = new App({
  target: document.body,
  props: {
    width: 500,
    height: 600,
  },
})

setupDocument()

export default app
