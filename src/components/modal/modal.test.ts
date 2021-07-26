import Modal from './modal.svelte'
import { render } from '@testing-library/svelte'
import { modal, someModal } from 'src/components/modal/store'
import { get } from 'svelte/store'

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

describe('components/modal/store.ts', () => {
  it('has mutually exclusive boolean state values', () => {
    modal.settings.toggle()
    expect(get(someModal)).toBe(true)
    modal.off()
    expect(get(someModal)).toBe(false)
    modal.shortcuts.set(true)
    expect(get(modal).shortcuts).toBe(true)
  })
})
