<script lang="ts">
  export let onClick: OptionalProp<
    svelte.JSX.MouseEventHandler<HTMLButtonElement>
  > = undefined
</script>

<button
  on:click={onClick}
  class="py-1 px-2 rounded-md bg-blue-600 text-white dark:text-black dark:bg-blue-300"
  {...$$restProps}
>
  <slot />
</button>
