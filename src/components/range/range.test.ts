import Range from './range.svelte'
import { render, fireEvent } from '@testing-library/svelte'

describe('components/range/range.svelte', () => {
  it('has a change handler that toggles a checked value', async () => {
    const mockChangeHandler = jest.fn()

    const screen = render(Range, {
      props: {
        label: 'Age',
        id: 'age-is-just-a-number-on-a-slider',
        onChange: mockChangeHandler,
      },
    })

    const range = screen.getByLabelText('Age')
    await fireEvent.change(range, { target: { value: '21' } })
    expect(mockChangeHandler).toHaveBeenCalled()
    expect(range).toHaveValue('21')
  })
})
