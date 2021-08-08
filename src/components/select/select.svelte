<script lang="ts">
  import cn from 'classnames'

  export let label: OptionalProp<string> = undefined,
    options: string[],
    selected: OptionalProp<string> = undefined,
    id: OptionalProp<string> = undefined,
    classNames: OptionalProp<string> = undefined,
    onBlur: OptionalProp<svelte.JSX.FocusEventHandler<HTMLSelectElement>> =
      undefined,
    required: OptionalProp<boolean> = undefined,
    ref: OptionalProp<HTMLSelectElement> = undefined

  /**
   * Filter escape key to prevent closing popup, and blur the input instead
   */
  const handleKeyDown: svelte.JSX.KeyboardEventHandler<HTMLSelectElement> = (
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
      <span class="text-red-500 px-0.5" title="required" aria-label="required"
        >*</span
      >
    {/if}
  </label>
{/if}
<select
  {id}
  class={cn(
    'rounded-sm border border-gray-800 px-2 py-1 dark:bg-gray-900 dark:border-gray-500 dark:text-white',
    classNames
  )}
  bind:this={ref}
  on:blur={onBlur}
  on:keydown={handleKeyDown}
  {required}
  {...$$restProps}
>
  {#each options as option}
    <option value={option} selected={option === selected}>{option}</option>
  {/each}
</select>
