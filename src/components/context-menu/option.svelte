<script lang="ts">
  /**
   * @accessibility When buttons implement the `disabled` attribute, they cannot
   * but focused with keyboard events, and thus are invisible to screen readers.
   */
  import cn from 'classnames'
  import { getContext, createEventDispatcher } from 'svelte'
  import type { SvelteComponent } from 'svelte'

  import type { DispatchClickContext } from 'src/components/context-menu/store'
  import { key } from 'src/components/context-menu/store'

  export let disabled = false,
    // Use `null` for text alignment to add margin where Icon would be
    Icon: OptionalProp<typeof SvelteComponent> | null = undefined,
    text: OptionalProp<string> = undefined

  const dispatch = createEventDispatcher()
  const { dispatchClick } = getContext<DispatchClickContext>(key)

  const handleClick = () => {
    if (!disabled) {
      dispatch('click')
      dispatchClick()
    }
  }
</script>

<button
  role="menuitem"
  class={cn(
    'py-1 px-3 flex items-center w-full',
    disabled
      ? 'cursor-default text-gray-500 hover:bg-transparent'
      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
  )}
  aria-disabled={disabled}
  on:click={handleClick}
>
  {#if text}
    {#if Icon}
      <svelte:component this={Icon} size={12} />
      <span class="ml-2">{text}</span>
    {:else if Icon === null}
      <span class="ml-icon">{text}</span>
    {:else}
      {text}
    {/if}
  {:else}
    <slot />
  {/if}
</button>

<style>
  .ml-icon {
    /* icon width (12px) + ml-2 (8px) */
    margin-left: 20px;
  }
</style>
