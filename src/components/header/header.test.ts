import Header from './header.svelte'
import { render } from '@testing-library/svelte'

describe('components/header/header.svelte', () => {
  it('has navigation buttons', async () => {
    const screen = render(Header, {
      props: { hidePopout: false, hideHome: false },
    })

    const popoutButton = screen.getByText('Pop out to a new window')
    expect(popoutButton).toBeInTheDocument()

    const tabButton = screen.getByText('Open in a new tab')
    expect(tabButton).toBeInTheDocument()
  })

  it('has layout buttons', async () => {
    const screen = render(Header)

    const listButton = screen.getByText('Show list layout')
    expect(listButton).toBeInTheDocument()

    const gridButton = screen.getByText('Show grid layout')
    expect(gridButton).toBeInTheDocument()
  })
})
