import { render, fireEvent } from '@testing-library/svelte'
import Header from './header.svelte'
import { getMessage } from 'src/utils/i18n'

describe('components/header/header.svelte', () => {
  it('has a settings button', async () => {
    const mockHandleSettings = jest.fn()

    const screen = render(Header, {
      props: {
        onClickSettings: mockHandleSettings,
      },
    })

    const settingsButton = screen.getByLabelText(getMessage('open_settings'))
    await fireEvent.click(settingsButton)
    expect(mockHandleSettings).toHaveBeenCalledTimes(1)
  })

  it('blurs search input on escape key', async () => {
    const screen = render(Header, {
      props: {
        onClickSettings: jest.fn(),
      },
    })

    const searchInput = screen.getByPlaceholderText(
      getMessage('search__input_placeholder')
    )
    searchInput.focus()
    expect(searchInput).toHaveFocus()
    await fireEvent.keyDown(searchInput, { key: 'Escape', code: 'Escape' })
    expect(searchInput).not.toHaveFocus()
  })
})
