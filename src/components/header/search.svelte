<script lang="ts">
  import Input from 'src/components/input/input.svelte'

  export let onSubmitSearch: svelte.JSX.FormEventHandler<HTMLFormElement>
  // TODO: add dropdown to narrow search to all/previous/saved
</script>

<form role="search" on:submit={onSubmitSearch} aria-label="Sessions and tabs">
  <Input id="search" classNames="w-full" type="text" placeholder="Search" />
</form>
