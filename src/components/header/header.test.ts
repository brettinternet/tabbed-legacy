import Header from './header.svelte'
import { render, fireEvent } from '@testing-library/svelte'

describe('components/header/header.svelte', () => {
  it('has a settings button', async () => {
    const mockHandleSettings = jest.fn()

    const screen = render(Header, {
      props: {
        onClickSettings: mockHandleSettings,
        onSubmitSearch: jest.fn(),
      },
    })

    const settingsButton = screen.getByLabelText('Open settings')
    await fireEvent.click(settingsButton)
    expect(mockHandleSettings).toHaveBeenCalledTimes(1)
  })

  it('blurs search input on escape key', async () => {
    const screen = render(Header, {
      props: {
        onClickSettings: jest.fn(),
        onSubmitSearch: jest.fn(),
      },
    })

    const searchInput = screen.getByPlaceholderText('Search')
    searchInput.focus()
    expect(searchInput).toHaveFocus()
    await fireEvent.keyDown(searchInput, { key: 'Escape', code: 'Escape' })
    expect(searchInput).not.toHaveFocus()
  })
})
