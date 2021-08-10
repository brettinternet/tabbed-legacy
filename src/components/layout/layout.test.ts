import Layout from './layout.svelte'
import { render } from '@testing-library/svelte'

describe('components/layout/layout.svelte', () => {
  it('updates the document title', () => {
    render(Layout, {
      props: {
        pageTitle: 'Welcome',
      },
    })

    expect(document.title).toMatch(/Welcome/)
  })

  it('renders a main element', () => {
    const screen = render(Layout)

    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })
})
