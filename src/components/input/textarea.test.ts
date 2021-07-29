import Textarea from './textarea.svelte'
import { render, fireEvent } from '@testing-library/svelte'

describe('components/input/textarea.svelte', () => {
  it('changes value with a change handler', async () => {
    const mockChangeHandler = jest.fn()

    const screen = render(Textarea, {
      props: {
        onChange: mockChangeHandler,
        label: 'Name',
        id: 'name',
      },
    })

    const textarea = screen.getByLabelText('Name')
    await fireEvent.change(textarea, { target: { value: 'Hi mom!' } })
    expect(textarea).toHaveValue('Johnny Bravo')
    expect(mockChangeHandler).toHaveBeenCalled()
  })

  it('blurs input on escape key', async () => {
    const screen = render(Textarea, {
      props: {
        label: 'Name',
        id: 'name',
      },
    })

    const textarea = screen.getByLabelText('Name')
    textarea.focus()
    expect(textarea).toHaveFocus()
    await fireEvent.keyDown(textarea, { key: 'Escape', code: 'Escape' })
    expect(textarea).not.toHaveFocus()
  })
})
