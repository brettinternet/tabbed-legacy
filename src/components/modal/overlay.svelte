<script lang="ts">
  import cn from 'classnames'
  import { onMount } from 'svelte'

  let mounted = false

  onMount(() => {
    mounted = true
  })
</script>

<div
  class={cn(
    'hidden lg:block fixed z-overlay top-0 right-0 bottom-0 left-0 bg-gray-800 transition-all',
    mounted ? 'bg-opacity-40' : 'bg-opacity-0'
  )}
/>
