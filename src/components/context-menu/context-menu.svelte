<script lang="ts">
  /**
   * @usage Add data-context-id to outer HTML elements to match a certain context menu
   */
  import { contextIds } from 'src/components/context-menu/store'
  import Menu from './menu.svelte'
  import GlobalContextOptions from './global-context-options.svelte'
  import Divider from './divider.svelte'

  export let id: string

  let pos = { x: 0, y: 0 },
    showMenu = false,
    target: HTMLElement | null

  const handleRightClick: svelte.JSX.MouseEventHandler<HTMLElement> = (ev) => {
    const clickTarget = ev.target as HTMLElement
    // Search closest ancestor for match in case inner element is clicked, also searches self
    target = clickTarget.closest(`[data-context-id="${id}"]`)

    const displayGlobal = id === contextIds.GLOBAL
    // Match global context menu when no data-context-id is matched, except when context on context-menu
    if (!target && displayGlobal && !clickTarget.closest('#context-menu')) {
      target = clickTarget
    }

    if (target && (displayGlobal || id === target.dataset.contextId)) {
      ev.preventDefault()
      pos = { x: ev.clientX, y: ev.clientY }
      showMenu = true
    }
  }

  const closeMenu = () => {
    showMenu = false
  }

  const handleKeydown: svelte.JSX.KeyboardEventHandler<Window> = (ev) => {
    if (ev.key === 'Escape') {
      ev.preventDefault()
      closeMenu()
    }
  }
</script>

<svelte:body on:contextmenu={handleRightClick} />
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
