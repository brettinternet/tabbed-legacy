import Radio from './radio.svelte'
import { render, fireEvent } from '@testing-library/svelte'

describe('components/radio/radio.svelte', () => {
  it('has a value and change handler that toggles a checked attribute', async () => {
    const mockChangeHandler = jest.fn()

    const screen = render(Radio, {
      props: {
        label: 'select me',
        id: 'radio-me',
        onChange: mockChangeHandler,
        checked: false,
        value: 'pick me!',
      },
    })

    const radio = screen.getByLabelText('select me')
    await fireEvent.click(radio)
    expect(radio).toHaveAttribute('value', 'pick me!')
    expect(mockChangeHandler).toHaveBeenCalled()
    expect(radio).toBeChecked()
  })
})
