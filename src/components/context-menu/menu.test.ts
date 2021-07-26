import { getContext, createEventDispatcher } from 'svelte'
import { render } from '@testing-library/svelte'
import { mocked } from 'ts-jest/utils'
import Slot from 'test/slot.svelte'
import Menu from './menu.svelte'
import Option from './option.svelte'
jest.mock('svelte')

describe('components/context-menu/menu.svelte', () => {
  beforeAll(() => {
    mocked(getContext).mockImplementation(() => ({
      dispatchClick: jest.fn(),
    }))
  })

  it('clicking a menu item dispatches an event', () => {
    const mockDispatch = jest.fn()
    mocked(createEventDispatcher).mockImplementation(() => mockDispatch)

    const screen = render(Slot, {
      props: {
        component: Menu,
        props: {
          x: 0,
          y: 0,
        },
        child: Option,
        childProps: {
          text: 'click!',
        },
      },
    })

    const button = screen.getByRole('menuitem')
    button.click()
    expect(mockDispatch).toHaveBeenCalled()
  })

  it('clicking outside menu dispatches an event', () => {
    const mockDispatch = jest.fn()
    mocked(createEventDispatcher).mockImplementation(() => mockDispatch)

    const screen = render(Menu, {
      props: {
        x: 0,
        y: 0,
      },
    })

    const menu = screen.getByRole('menu')
    menu.click()
    expect(mockDispatch).not.toHaveBeenCalled()
    document.body.click()
    expect(mockDispatch).toHaveBeenCalled()
  })
})
