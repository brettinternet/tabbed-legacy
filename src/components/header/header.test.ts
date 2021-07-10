import Header from './header.svelte'
import { render, fireEvent } from '@testing-library/svelte'

describe('components/header/header.svelte', () => {
  it('has navigation buttons', async () => {
    const mockHandlePopout = jest.fn()
    const mockHandleHome = jest.fn()

    const screen = render(Header, {
      props: {
        onClickPopout: mockHandlePopout,
        onClickHome: mockHandleHome,
      },
    })

    const popoutButton = screen.getByLabelText('Pop out to a new window')
    expect(popoutButton).toBeInTheDocument()
    await fireEvent.click(popoutButton)
    expect(mockHandlePopout).toHaveBeenCalledTimes(1)

    const tabButton = screen.getByLabelText('Open in a new tab')
    await fireEvent.click(tabButton)
    expect(mockHandleHome).toHaveBeenCalledTimes(1)
  })

  it('has layout buttons', async () => {
    const mockHandleList = jest.fn()
    const mockHandleGrid = jest.fn()

    const screen = render(Header, {
      props: {
        onClickListLayout: mockHandleList,
        onClickGridLayout: mockHandleGrid,
      },
    })

    const listButton = screen.getByLabelText('Show list layout')
    listButton.click()
    expect(mockHandleList).toHaveBeenCalledTimes(1)

    const gridButton = screen.getByLabelText('Show grid layout')
    gridButton.click()
    expect(mockHandleGrid).toHaveBeenCalledTimes(1)
  })

  it('has a settings button', async () => {
    const mockHandleSettings = jest.fn()

    const screen = render(Header, {
      props: {
        onClickSettings: mockHandleSettings,
      },
    })

    const settingsButton = screen.getByLabelText('Settings')
    settingsButton.click()
    expect(mockHandleSettings).toHaveBeenCalledTimes(1)
  })
})
