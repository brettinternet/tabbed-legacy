<script lang="ts">
  import { fade } from 'svelte/transition'
</script>

<div
  transition:fade={{ duration: 150 }}
  class="hidden lg:block fixed z-overlay top-0 right-0 bottom-0 left-0 bg-gray-800 transition-all bg-opacity-30"
/>
