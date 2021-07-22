import { render, waitFor } from '@testing-library/svelte'

import { popupUrl } from 'src/utils/env'
import App from './app.svelte'

describe('components/app/app.svelte', () => {
  it('renders the app and applies body dimensions when window is popup', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        href: popupUrl,
      },
    })

    const screen = render(App)

    await waitFor(() => {
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })
  })
})
