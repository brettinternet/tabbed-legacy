<script lang="ts">
  import { debounce } from 'lodash'

  // TODO: add dropdown to narrow search to all/previous/saved
  import Input from 'src/components/input/input.svelte'
  import { searchValue } from 'src/components/search/store'
  import { searchSessions } from 'src/components/search/send'
  import X from 'src/components/icons/x.svelte'

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

  const clear: svelte.JSX.MouseEventHandler<HTMLButtonElement> = () => {
    searchValue.set(undefined)
    if (input) {
      input.value = ''
      input.focus()
    }
  }

  const debouncedChange = debounce(handleChange, 250)
</script>

<form
  role="search"
  on:submit={handleSubmit}
  aria-label="Sessions and tabs"
  class="relative"
>
  <Input
    id="search"
    classNames="w-full xxs:pr-8"
    type="text"
    placeholder="Search"
    onInput={debouncedChange}
    bind:ref={input}
  />
  {#if $searchValue}
    <button
      class="hidden xxs:flex items-center justify-center absolute top-0 right-0 h-full w-8"
      on:click={clear}
    >
      <X />
    </button>
  {/if}
</form>
