<script lang="ts">
  /**
   * @accessibility use rows and gridcells
   * https://www.w3.org/TR/2017/WD-wai-aria-practices-1.1-20170628/examples/grid/LayoutGrids.html
   */
  import cn from 'classnames'

  import {
    focusWindowTab,
    focusWindow,
    openTab,
    openWindow,
  } from 'src/utils/browser/query'
  import Window from 'src/components/icons/window.svelte'
  import { replaceImageError } from 'src/components/sessions/dom'
  import Focused from 'src/components/icons/eye.svelte'
  import { contextIds } from 'src/components/context-menu/store'

  export let windows: browser.windows.Window[],
    current: boolean,
    ariaLabelledby: string,
    sessionId: string,
    currentWindowId: number | undefined,
    currentTabId: number | undefined

  const handleWindowClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> =
    async (ev) => {
      const button = ev.currentTarget
      if (button.dataset.windowId) {
        const windowId: number | undefined = parseInt(button.dataset.windowId)
        const ariaDisabled = button.getAttribute('aria-disabled') === 'true'
        if (windowId && !ariaDisabled) {
          if (current) {
            await focusWindow(windowId)
          } else {
            const selectedWindow = windows.find(({ id }) => id === windowId)
            if (selectedWindow) {
              await openWindow(selectedWindow)
            }
          }
        }
      }
    }

  const handleTabLinkClick: svelte.JSX.MouseEventHandler<HTMLAnchorElement> =
    async (ev) => {
      const anchor = ev.currentTarget
      if (anchor.dataset.tabId && anchor.dataset.windowId) {
        const tabId: number | undefined = parseInt(anchor.dataset.tabId)
        const windowId: number | undefined = parseInt(anchor.dataset.windowId)
        if (tabId && windowId) {
          ev.preventDefault()
          if (current) {
            const ariaDisabled = anchor.getAttribute('aria-disabled') === 'true'
            if (!ariaDisabled) {
              await focusWindowTab(windowId, tabId)
              currentWindowId = windowId
              currentTabId = tabId
            }
          } else {
            const selectedWindow = windows.find(({ id }) => id === windowId)
            const selectedTab = selectedWindow?.tabs?.find(
              ({ id }) => id === tabId
            )
            if (selectedTab) {
              const { url, pinned } = selectedTab
              await openTab({ url, pinned }, selectedWindow?.incognito)
            }
          }
        }
      }
    }
</script>

<div role="region" aria-labelledby={ariaLabelledby}>
  {#each windows as { id: windowId, tabs }, i}
    <div class={cn(i !== 0 && 'mt-4')}>
      <div
        class={cn(
          'flex flex-row items-center justify-between py-3 xl:justify-start',
          currentWindowId === windowId && 'text-green-500'
        )}
      >
        <div class="flex flex-row items-center mr-3 leading-5">
          <div class="flex justify-center w-5 mr-3"><Window /></div>
          <h2
            class="font-semibold flex items-center overflow-hidden whitespace-pre"
          >
            <button
              data-context-id={contextIds.WINDOW}
              data-session-id={sessionId}
              data-window-id={windowId}
              on:click={handleWindowClick}
              aria-disabled={currentWindowId === windowId}
              class="overflow-ellipsis overflow-hidden m-outline"
            >
              {#if currentWindowId === windowId}Current{' '}{/if}Window
            </button>
            {#if currentWindowId === windowId}
              <span class="ml-2"><Focused /></span>
            {/if}
          </h2>
        </div>
        {#if tabs}
          <div
            class="text-gray-500 font-extralight whitespace-nowrap overflow-ellipsis overflow-hidden"
          >
            {tabs.length} tabs
          </div>
        {/if}
      </div>
      {#if tabs}
        <ol role="grid" class="overflow-hidden">
          {#each tabs as { id: tabId, windowId, title, url, favIconUrl }}
            {#if title || url}
              <li role="row" class="flex flex-row">
                <div class="flex justify-center h-5 w-5 min-w-5 mb-1 mr-3">
                  {#if favIconUrl}
                    <img use:replaceImageError src={favIconUrl} alt={title} />
                  {/if}
                </div>
                <div
                  role="gridcell"
                  class={cn(
                    'leading-5 inline-flex items-center',
                    'overflow-hidden whitespace-pre',
                    tabId === currentTabId && 'text-green-500'
                  )}
                >
                  {#if url}
                    <a
                      data-context-id={contextIds.TAB}
                      data-session-id={sessionId}
                      data-window-id={windowId}
                      data-tab-id={tabId}
                      href={url}
                      on:click={handleTabLinkClick}
                      class={cn(
                        'overflow-ellipsis overflow-hidden mx-outline',
                        tabId !== currentTabId && 'hover:underline'
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-disabled={tabId === currentTabId}
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
                  {#if tabId === currentTabId}
                    <span class="ml-2"><Focused /></span>
                  {/if}
                </div>
              </li>
            {/if}
          {/each}
        </ol>
      {/if}
    </div>
  {/each}
</div>
