<script lang="ts">
  /**
   * @accessibility https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-1/menubar-1.html#
   */
  import { setContext, createEventDispatcher, onMount, onDestroy } from 'svelte'
  import { createFocusTrap } from 'focus-trap'
  import type { FocusTrap } from 'focus-trap'

  import { portal } from 'src/utils/portal'
  import { clickAway } from 'src/utils/click-away'
  import type { DispatchClickContext } from 'src/components/context-menu/store'
  import { key } from 'src/components/context-menu/store'

  export let x: number, y: number, target: HTMLElement

  let menu: HTMLDivElement | undefined, trap: FocusTrap

  onMount(() => {
    if (menu) {
      trap = createFocusTrap(menu, {
        clickOutsideDeactivates: true,
      })
      trap.activate()
    }
  })

  onDestroy(() => {
    if (menu) {
      trap.deactivate({
        returnFocus: true,
      })
    }
  })

  $: {
    if (menu) {
      const rect = menu.getBoundingClientRect()
      x = Math.min(window.innerWidth - rect.width, x)
      if (y > window.innerHeight - rect.height) {
        y -= rect.height
      }
    }
  }

  const dispatch = createEventDispatcher()

  const click = () => {
    dispatch('click')
  }

  setContext<DispatchClickContext>(key, {
    dispatchClick: click,
    target,
  })

  const clickOutside = () => {
    dispatch('clickoutside')
  }
</script>

<div
  id="context-menu"
  data-no-context-menu
  role="menu"
  bind:this={menu}
  use:portal
  use:clickAway
  on:clickAway={clickOutside}
  style="top: {y}px; left: {x}px;"
  class="absolute border border-gray-300 shadow-lg bg-white dark:bg-gray-800 dark:border-gray-900 z-context-menu w-44 dark:text-white"
>
  <slot />
</div>
