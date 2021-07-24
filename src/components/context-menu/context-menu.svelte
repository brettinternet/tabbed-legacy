<script lang="ts">
  /**
   * @usage Add data-context-id to outer HTML elements to match a certain context menu
   * Add data-no-context-menu to disable the global context menu
   */
  import { onDestroy, onMount } from 'svelte'

  import { objValue } from 'src/utils/helpers'
  import { contextIds } from 'src/components/context-menu/store'
  import type { ContextId } from 'src/components/context-menu/store'
  import Menu from './menu.svelte'
  import GlobalContextOptions from './global-context-options.svelte'
  import Divider from './divider.svelte'

  export let id: string

  let pos = { x: 0, y: 0 },
    showMenu = false,
    target: HTMLElement | null

  const closeMenu = () => {
    showMenu = false
    window.removeEventListener('scroll', handleScroll)
  }

  const handleScroll = () => {
    if (showMenu) {
      closeMenu()
    }
  }

  const handleRightClick = (ev: MouseEvent) => {
    const clickTarget = ev.target as HTMLElement
    console.log('clickTarget: ', clickTarget)
    // Search closest ancestor for match in case inner element is clicked, also searches self
    target = clickTarget.closest(`[data-context-id="${id}"]`)

    let contextId: ContextId | undefined
    const displayGlobal = id === contextIds.GLOBAL
    if (
      // Match global context menu
      displayGlobal &&
      // When no data-context-id is match
      !clickTarget.closest('[data-context-id]') &&
      // Except when context menu disabled in some ancestor
      !clickTarget.closest('[data-no-context-menu]')
    ) {
      target = clickTarget
    } else {
      contextId = objValue<typeof contextIds>(
        target?.dataset.contextId,
        contextIds
      )
    }

    if (target && (displayGlobal || id === contextId)) {
      ev.preventDefault()
      pos = { x: ev.clientX, y: ev.clientY }
      showMenu = true
      window.addEventListener('scroll', handleScroll, {
        once: true,
      })
    }
  }

  const handleKeydown: svelte.JSX.KeyboardEventHandler<Window> = (ev) => {
    if (ev.key === 'Escape') {
      ev.preventDefault()
      closeMenu()
    }
  }

  onMount(() => {
    document.addEventListener('contextmenu', handleRightClick)
  })

  onDestroy(() => {
    document.removeEventListener('contextmenu', handleRightClick)
    closeMenu()
  })
</script>

<svelte:window on:keydown={handleKeydown} />

{#if showMenu && target}
  <Menu {...pos} on:click={closeMenu} on:clickoutside={closeMenu} {target}>
    <!-- https://svelte.dev/docs#slots_object -->
    {#if $$slots.default}
      <slot {target} />
      <Divider />
    {/if}
    <GlobalContextOptions />
  </Menu>
{/if}
