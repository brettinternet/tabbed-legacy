import Button from './button.svelte'
import { render, fireEvent } from '@testing-library/svelte'

/**
 * @issue https://github.com/sveltejs/svelte/pull/4296
 */
describe('components/button/button.svelte', () => {
  it('has a label text', async () => {
    const mockClickHandler = jest.fn()

    const screen = render(Button, {
      props: {
        onClick: mockClickHandler,
        label: 'click me',
      },
    })

    const button = screen.getByText('click me')
    await fireEvent.click(button)
    expect(mockClickHandler).toHaveBeenCalledTimes(1)
  })
})
