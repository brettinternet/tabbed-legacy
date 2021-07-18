import Input from './input.svelte'
import { render, fireEvent } from '@testing-library/svelte'

describe('components/input/input.svelte', () => {
  it('changes value with a change handler', async () => {
    const mockChangeHandler = jest.fn()

    const screen = render(Input, {
      props: {
        onChange: mockChangeHandler,
        label: 'Name',
        id: 'name',
      },
    })

    const input = screen.getByLabelText('Name')
    await fireEvent.change(input, { target: { value: 'Johnny Bravo' } })
    expect(input).toHaveValue('Johnny Bravo')
    expect(mockChangeHandler).toHaveBeenCalled()
  })

  it('blurs input on escape key', async () => {
    const screen = render(Input, {
      props: {
        label: 'Name',
        id: 'name',
      },
    })

    const input = screen.getByLabelText('Name')
    input.focus()
    expect(input).toHaveFocus()
    await fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' })
    expect(input).not.toHaveFocus()
  })
})
