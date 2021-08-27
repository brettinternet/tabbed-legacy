<script lang="ts">
  import cn from 'classnames'
  import { getContext } from 'svelte'

  import type { RingContext } from 'src/components/focus/context'
  import { key, visible, activeRingContext } from 'src/components/focus/context'

  const instanceId = getContext<string>(key)
  const ringContext = activeRingContext.get(instanceId)
  $: console.log(
    'RING.SVELTE',
    ringContext?.visible,
    $visible,
    $activeRingContext,
    ringContext?.id
  )
</script>

{#if ringContext?.visible && $visible && $activeRingContext === ringContext.id}
  <div
    id="focus-ring"
    class={cn(
      ringContext.className,
      'absolute block pointer-events-none bg-none m-0 p-0 rounded shadow-focus-ring'
    )}
    style={ringContext.getStyles()}
  />
{/if}
