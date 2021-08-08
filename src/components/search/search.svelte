<script lang="ts">
  import { debounce } from 'lodash'

  // TODO: add dropdown to narrow search to all/previous/saved
  import Input from 'src/components/input/input.svelte'
  import { searchValue } from 'src/components/search/store'
  import { searchSessions } from 'src/components/search/send'

  const submitSearch = async (text?: string) => {
    searchValue.set(text)
    if (text?.trim()) {
      const results = await searchSessions(text)
      console.log('results: ', results)
    }
  }

  let input: HTMLInputElement | undefined

  const handleSubmit: svelte.JSX.FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault()
    const query = input?.value
    void submitSearch(query)
  }

  const handleChange: svelte.JSX.ChangeEventHandler<HTMLInputElement> = (
    ev
  ) => {
    ev.preventDefault()
    const query = input?.value
    void submitSearch(query)
  }

  const debouncedChange = debounce(handleChange, 250)
</script>

<form role="search" on:submit={handleSubmit} aria-label="Sessions and tabs">
  <Input
    id="search"
    classNames="w-full"
    type="text"
    placeholder="Search"
    onInput={debouncedChange}
    bind:ref={input}
  />
</form>
