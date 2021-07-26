import { render } from '@testing-library/svelte'
import { getContext, createEventDispatcher } from 'svelte'
import { mocked } from 'ts-jest/utils'
import Option from './option.svelte'
jest.mock('svelte')

describe('components/context-menu/option.svelte', () => {
  it("disabled options can still be focused, but don't propagate events", () => {
    const mockClickDispatch = jest.fn()
    const mockDispatch = jest.fn()
    mocked(getContext).mockImplementation(() => ({
      dispatchClick: mockClickDispatch,
    }))
    mocked(createEventDispatcher).mockImplementation(() => mockDispatch)

    const screen = render(Option, {
      props: {
        disabled: true,
        text: 'click!',
      },
    })

    const button = screen.getByRole('menuitem')
    button.click()
    expect(mockClickDispatch).not.toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()
  })
})
