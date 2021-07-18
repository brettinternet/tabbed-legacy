import Toggle from './toggle.svelte'
import { render, fireEvent } from '@testing-library/svelte'

describe('components/toggle/toggle.svelte', () => {
  it('has a change handler that toggles a checked attribute', async () => {
    const mockChangeHandler = jest.fn()

    const screen = render(Toggle, {
      props: {
        label: 'switch me',
        onChange: mockChangeHandler,
        id: 'switch',
        checked: false,
      },
    })

    const toggle = screen.getByLabelText('switch me')
    expect(toggle).not.toBeChecked()
    await fireEvent.click(toggle)
    expect(toggle).toBeChecked()
    expect(mockChangeHandler).toHaveBeenCalled()
  })
})
