import 'src/i18n'
import 'src/utils/tailwind.css'
import Popup from './popup.svelte'

const app = new Popup({
  target: document.body,
});

export default app;
