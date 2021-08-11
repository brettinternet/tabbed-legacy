<script lang="ts">
  import cn from 'classnames'

  export let label: OptionalProp<string> = undefined,
    id: OptionalProp<string> = undefined,
    classNames: OptionalProp<string> = undefined,
    onChange: OptionalProp<svelte.JSX.FormEventHandler<HTMLTextAreaElement>> =
      undefined,
    required: OptionalProp<boolean> = undefined,
    ref: OptionalProp<HTMLTextAreaElement> = undefined

  /**
   * Filter escape key to prevent closing popup, and blur the input instead
   */
  const handleKeyDown: svelte.JSX.KeyboardEventHandler<HTMLTextAreaElement> = (
    ev
  ) => {
    if (ev.key === 'Escape') {
      ev.preventDefault()
      ev.currentTarget.blur()
    }
  }
</script>

{#if label}
  <label for={id} class="block mb-2"
    >{label}
    {#if required}
      <span class="text-red-500 ml-0.5" title="required" aria-label="required"
        >*</span
      >
    {/if}
  </label>
{/if}
<textarea
  {id}
  class={cn(
    'rounded-sm border border-gray-800 px-2 py-1 dark:bg-gray-900 dark:border-gray-500 dark:text-white',
    classNames
  )}
  on:change={onChange}
  on:keydown={handleKeyDown}
  bind:this={ref}
  {required}
  {...$$restProps}
/>
