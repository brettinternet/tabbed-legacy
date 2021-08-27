<script lang="ts">
  import { setContext } from 'svelte'

  import { key, FocusRingContextManager } from 'src/components/focus/context'
  import Ring from './ring.svelte'

  export let container: HTMLElement | undefined

  $: if (container) {
    const ringContext = new FocusRingContextManager(container)
    setContext(key, ringContext.id)
  }
</script>

<slot />
<Ring />
