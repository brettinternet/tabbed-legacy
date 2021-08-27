<script lang="ts">
  import cn from 'classnames'

  import { focusRing } from 'src/components/focus/focus-ring'
  import { getRingContext } from 'src/components/focus/context'

  export let label: OptionalProp<string> = undefined,
    id: OptionalProp<string> = undefined,
    classNames: OptionalProp<string> = undefined,
    onChange: OptionalProp<svelte.JSX.FormEventHandler<HTMLInputElement>> =
      undefined,
    onInput: OptionalProp<svelte.JSX.FormEventHandler<HTMLInputElement>> =
      undefined,
    required: OptionalProp<boolean> = undefined,
    ref: OptionalProp<HTMLInputElement> = undefined

  /**
   * Filter escape key to prevent closing popup, and blur the input instead
   */
  const handleKeyDown: svelte.JSX.KeyboardEventHandler<HTMLInputElement> = (
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
<input
  bind:this={ref}
  use:focusRing={{ instanceId: getRingContext() }}
  {id}
  class={cn(
    'rounded-sm border border-gray-800 px-2 py-1 dark:bg-gray-900 dark:border-gray-500 dark:text-white',
    classNames
  )}
  on:change={onChange}
  on:keydown={handleKeyDown}
  on:input={onInput}
  {required}
  {...$$restProps}
/>
