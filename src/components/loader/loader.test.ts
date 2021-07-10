import Loader from './loader.svelte'
import { render } from '@testing-library/svelte'

describe('components/loader/loader.svelte', () => {
  it('has an accessible message', async () => {
    const screen = render(Loader)
    const text = screen.getByText(/loading/i)
    expect(text).toBeInTheDocument()
  })
})
