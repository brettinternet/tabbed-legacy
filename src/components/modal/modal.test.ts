import Modal from './modal.svelte'
import { render } from '@testing-library/svelte'

describe('components/modal/modal.svelte', () => {
  it('invokes a close fn when an element outside the root is clicked', () => {
    const mockCloseHandler = jest.fn()

    const screen = render(Modal, {
      props: {
        close: mockCloseHandler,
        ariaLabelledby: '',
      },
    })

    const modal = screen.getByRole('dialog')
    modal.click()
    expect(mockCloseHandler).not.toHaveBeenCalled()
    document.body.click()
    expect(mockCloseHandler).toHaveBeenCalled()
  })
})
