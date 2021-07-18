import Shortcuts from './shortcuts.svelte'
import { render } from '@testing-library/svelte'

describe('components/shortcuts/shortcuts.svelte', () => {
  it('has a header', () => {
    const screen = render(Shortcuts, {
      props: {
        close: jest.fn(),
      },
    })

    const header = screen.getByText('Shortcuts')
    expect(header).toBeInTheDocument()
  })
})
