<script lang="ts">
  import cn from 'classnames'

  export let onClick: OptionalProp<
      svelte.JSX.MouseEventHandler<HTMLButtonElement>
    > = undefined,
    secondary: OptionalProp<boolean> = undefined
</script>

<button
  on:click={onClick}
  class={cn(
    'py-1 px-2 rounded-md',
    secondary
      ? 'bg-gray-200 text-black dark:bg-gray-700 dark:text-gray-100'
      : 'bg-blue-600 text-white dark:bg-blue-300 dark:text-black'
  )}
  {...$$restProps}
>
  <slot />
</button>
