import Anchor from './anchor.svelte'
import Slot from 'test/slot.svelte'
import { render } from '@testing-library/svelte'

describe('components/anchor/anchor.svelte', () => {
  it('can open links in a new tab', () => {
    const screen = render(Slot, {
      props: {
        component: Anchor,
        text: 'link text',
        props: {
          href: 'https://example.com',
          newTab: true,
        },
      },
    })

    const anchor = screen.getByText('link text')
    expect(anchor).toHaveAttribute('target', '_blank')
    expect(anchor).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
