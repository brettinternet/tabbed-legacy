<script lang="ts">
  /**
   * @usage Add data-context-id to outer HTML elements to match a certain context menu
   * Add data-no-context-menu to disable the global context menu
   */
  import { onDestroy, onMount } from 'svelte'

  import { objValue } from 'src/utils/helpers'
  import { contextIds, contextMenu } from 'src/components/context-menu/store'
  import type { RegisteredContextMenus } from 'src/components/context-menu/store'
  import Menu from './menu.svelte'
  import GlobalContextOptions from './global-context-options.svelte'
  import Divider from './divider.svelte'
  import MenuOption from './option.svelte'

  let pos = { x: 0, y: 0 },
    showMenu = false,
    target: HTMLElement | null,
    contextMenuOptions:
      | RegisteredContextMenus[keyof RegisteredContextMenus]
      | undefined
      | null

  const closeMenu = () => {
    showMenu = false
    window.removeEventListener('scroll', closeMenu)
    window.removeEventListener('blur', closeMenu)
    window.removeEventListener('resize', closeMenu)
    if (target && contextMenuOptions?.onClose) {
      contextMenuOptions.onClose(target)
    }
    target = null
  }

  const handleKeydown = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
      ev.preventDefault()
      closeMenu()
    }
  }

  const handleRightClick = (ev: MouseEvent) => {
    // if context menu wasn't closed, but was invoked immediately elsewhere
    if (target && contextMenuOptions?.onClose) {
      contextMenuOptions.onClose(target)
    }

    const clickTarget = ev.target as HTMLElement

    // Don't run if context menu disabled in some ancestor
    if (!clickTarget.closest('[data-no-context-menu]')) {
      // Search closest ancestor for match in case inner element is clicked, also searches self
      target = clickTarget.closest(`[data-context-id]`)

      if (target) {
        const contextId = objValue<typeof contextIds>(
          target?.dataset.contextId,
          contextIds
        )
        if (contextId) {
          contextMenuOptions = $contextMenu[contextId]
        }
      } else {
        contextMenuOptions = null
        target = clickTarget
      }

      if (target) {
        ev.preventDefault()
        pos = { x: ev.pageX, y: ev.pageY }
        showMenu = true
        window.addEventListener('keydown', handleKeydown)
        window.addEventListener('scroll', closeMenu, {
          once: true,
          capture: true,
        })
        window.addEventListener('blur', closeMenu, {
          once: true,
        })
        window.addEventListener('resize', closeMenu, {
          once: true,
        })
      }
    }
  }

  onMount(() => {
    document.addEventListener('contextmenu', handleRightClick)
  })

  onDestroy(() => {
    document.removeEventListener('contextmenu', handleRightClick)
    window.removeEventListener('keydown', handleKeydown)
    closeMenu()
  })
</script>

{#if showMenu && target}
  <Menu {...pos} on:click={closeMenu} on:clickoutside={closeMenu}>
    {#if contextMenuOptions}
      {#each contextMenuOptions.items(target) as { onClick, ...props } (onClick.toString())}
        <MenuOption on:click={onClick} {...props} />
      {/each}
      <Divider />
    {/if}
    <GlobalContextOptions />
  </Menu>
{/if}
