<script lang="ts">
  export let href: string,
    newTab = false

  const props = newTab
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
        ...$$restProps,
      }
    : $$restProps
</script>

<a
  {href}
  class="text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-500"
  {...props}
>
  <slot />
</a>
