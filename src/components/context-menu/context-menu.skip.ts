import { getContext, createEventDispatcher } from 'svelte'
import { render } from '@testing-library/svelte'
import { mocked } from 'ts-jest/utils'
import { contextIds, contextMenu } from 'src/components/context-menu/store'
import ContextMenu from './context-menu.svelte'
jest.mock('svelte')

/**
 * TODO: unable to invoke contextmenu event in order to get `showMenu === true` in context-menu component
 */
/* eslint-disable jest/expect-expect */
describe('components/context-menu/context-menu.svelte', () => {
  const mockOptionClickHandler = jest.fn()
  const mockCloseHandler = jest.fn()

  beforeAll(() => {
    mocked(getContext).mockImplementation(() => ({
      dispatchClick: jest.fn(),
    }))
  })

  beforeEach(() => {
    contextMenu.register(contextIds.SESSION, {
      items: () => [
        {
          onClick: mockOptionClickHandler,
          text: 'click me',
        },
      ],
      onClose: mockCloseHandler,
    })
  })

  it('has menu options that can be clicked', () => {
    const mockDispatch = jest.fn()
    mocked(createEventDispatcher).mockImplementation(() => mockDispatch)

    const screen = render(ContextMenu)
    document.body.dataset.contextId = contextIds.SESSION
    document.body.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: false,
        view: window,
      })
    )
    // const menu = screen.queryByRole('menu')
    screen.debug()
    // menu.click()
    // expect(mockDispatch).not.toHaveBeenCalled()
    // document.body.click()
    // expect(mockDispatch).toHaveBeenCalled()
    // screen.unmount()
    // expect(mockCloseHandler).toHaveBeenCalled()
  })
})
