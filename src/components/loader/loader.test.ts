import { render } from '@testing-library/svelte'
import Loader from './loader.svelte'
import { getMessage } from 'src/utils/i18n'

describe('components/loader/loader.svelte', () => {
  it('has an accessible message', () => {
    const screen = render(Loader)
    const text = screen.getByLabelText(getMessage('loading'))
    expect(text).toBeInTheDocument()
  })
})
