<script lang="ts">
  import cn from 'classnames'

  import { focusWindowTab, focusWindow } from 'src/utils/browser/query'
  import Window from 'src/components/icons/window.svelte'
  import { replaceImageError } from 'src/components/sessions/dom'
  import Focused from 'src/components/icons/eye.svelte'

  export let windows: browser.windows.Window[],
    ariaLabelledby: string,
    currentWindowId: OptionalProp<number> = undefined,
    currentTabId: OptionalProp<number> = undefined

  const handleWindowClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> = async ev => {
    const button = ev.currentTarget
    if (button.dataset.windowId) {
      const windowId: number | undefined = parseInt(button.dataset.windowId)
      if (windowId) {
        await focusWindow(windowId)
      }
    }
  }

  const handleTabLinkClick: svelte.JSX.MouseEventHandler<HTMLAnchorElement> = async ev => {
    const anchor = ev.currentTarget
    if (anchor.dataset.tabId && anchor.dataset.windowId) {
      const tabId: number | undefined = parseInt(anchor.dataset.tabId)
      const windowId: number | undefined = parseInt(anchor.dataset.windowId)
      if (tabId && windowId) {
        ev.preventDefault()
        const ariaDisabled = anchor.getAttribute('aria-disabled') === 'true'
        if (!ariaDisabled) {
          await focusWindowTab(windowId, tabId)
          currentWindowId = windowId
          currentTabId = tabId
        }
      }
    }
  }
</script>

<div role="region" aria-labelledby={ariaLabelledby}>
  {#each windows as { id, tabs }, i}
    <div class={cn(i !== 0 && 'mt-4')}>
      <div
        class={cn(
          'flex flex-row items-center justify-between xl:justify-start',
          currentWindowId === id && 'text-blue-700'
        )}
      >
        <div class="flex flex-row items-center py-3 mr-3 leading-5">
          <div class="flex justify-center w-5 mr-3"><Window /></div>
          <h2 class="font-semibold flex items-center">
            <button data-window-id={id} on:click={handleWindowClick}>
              {#if currentWindowId === id}
                Current
              {/if}
              Window
            </button>
            {#if currentWindowId === id}
              <span class="text-blue-700 ml-2"><Focused /></span>
            {/if}
          </h2>
        </div>
        {#if tabs}
          <div class="text-gray-500 font-extralight">
            {tabs.length} tabs
          </div>
        {/if}
      </div>
      {#if tabs}
        <ul class="overflow-hidden">
          {#each tabs as { id, windowId, title, url, favIconUrl }}
            {#if title || url}
              <li class="flex flex-row">
                <div class="flex justify-center h-5 w-5 mb-1 mr-3 ">
                  {#if favIconUrl}
                    <img use:replaceImageError src={favIconUrl} alt={title} />
                  {/if}
                </div>
                <div class="leading-5 inline-flex items-center">
                  {#if url}
                    <a
                      data-tab-id={id}
                      data-window-id={windowId}
                      href={url}
                      on:click={handleTabLinkClick}
                      class={cn(
                        !(id === currentTabId) && 'hover:underline',
                        'py-1'
                        // 'overflow-ellipsis overflow-hidden whitespace-pre'
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-disabled={id === currentTabId}
                    >
                      {#if title}
                        {title}
                      {:else}
                        {url}
                      {/if}
                    </a>
                  {:else}
                    <span>
                      {title}
                    </span>
                  {/if}
                  {#if id === currentTabId}
                    <span class="text-blue-700 ml-2"><Focused /></span>
                  {/if}
                </div>
              </li>
            {/if}
          {/each}
        </ul>
      {/if}
    </div>
  {/each}
</div>
