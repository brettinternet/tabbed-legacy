import Button from './button.svelte'
import Slot from 'test/slot.svelte'
import { render, fireEvent } from '@testing-library/svelte'

describe('components/button/button.svelte', () => {
  it('has a label text', async () => {
    const mockClickHandler = jest.fn()

    const screen = render(Slot, {
      props: {
        component: Button,
        text: 'click me',
        props: {
          onClick: mockClickHandler,
        },
      },
    })

    const button = screen.getByText('click me')
    await fireEvent.click(button)
    expect(mockClickHandler).toHaveBeenCalledTimes(1)
  })
})
