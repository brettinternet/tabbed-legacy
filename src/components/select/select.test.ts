import Select from './select.svelte'
import { render, fireEvent } from '@testing-library/svelte'

describe('components/select/select.svelte', () => {
  it('changes value with a change handler', async () => {
    const mockBlurHandler = jest.fn()

    const screen = render(Select, {
      props: {
        onBlur: mockBlurHandler,
        options: ['Bob Sackett', 'Tom Bergeron'],
        label: "American's Funniest Home Videos",
        id: 'my-select',
      },
    })

    const select = screen.getByLabelText("American's Funniest Home Videos")
    select.focus()
    expect(select).toHaveFocus()
    await fireEvent.select(select, { target: { value: 'Bob Sackett' } })
    select.blur()
    expect(select).toHaveValue('Bob Sackett')
    expect(mockBlurHandler).toHaveBeenCalled()
  })

  it('blurs select on escape key', async () => {
    const screen = render(Select, {
      props: {
        label: 'Test',
        options: ['Bob Sackett', 'Tom Bergeron'],
        id: 'my-select',
      },
    })

    const select = screen.getByLabelText('Test')
    select.focus()
    expect(select).toHaveFocus()
    await fireEvent.keyDown(select, { key: 'Escape', code: 'Escape' })
    expect(select).not.toHaveFocus()
  })
})
