<script lang="ts">
  import cn from 'classnames'

  export let label: string = null,
    id: string = null,
    classNames: string = null,
    onChange: svelte.JSX.FormEventHandler<HTMLInputElement>

  /**
   * Filter escape key to prevent closing popup, and blur the input instead
   */
  const handleSearchKeyDown: svelte.JSX.KeyboardEventHandler<HTMLInputElement> = ev => {
    if (ev.key === 'Escape') {
      ev.preventDefault()
      ev.currentTarget.blur()
    }
  }
</script>

{#if label}
  <label for={id} class="block mb-2">{label}</label>
{/if}
<input
  {id}
  class={cn(
    'rounded-sm border border-gray-800 px-2 py-1 dark:bg-gray-900 dark:border-gray-500 dark:text-white',
    classNames
  )}
  on:change={onChange}
  on:keydown={handleSearchKeyDown}
  {...$$restProps}
/>
