<script lang="ts">
  /**
   * @accessibility use rows and gridcells
   * https://www.w3.org/TR/2017/WD-wai-aria-practices-1.1-20170628/examples/grid/LayoutGrids.html
   */
  import cn from 'classnames'

  import Window from 'src/components/icons/window.svelte'
  import Pin from 'src/components/icons/pin.svelte'
  import Incognito from 'src/components/icons/eye-closed.svelte'
  import Minimize from 'src/components/icons/minimize.svelte'
  import { replaceImageError } from 'src/components/sessions/dom'
  import Focused from 'src/components/icons/eye.svelte'
  import { contextIds } from 'src/components/context-menu/store'
  import type { OpenTabOptions, OpenWindowOptions } from 'src/utils/messages'

  export let windows: browser.windows.Window[],
    ariaLabelledby: string,
    sessionId: string,
    currentWindowId: number | undefined,
    currentTabId: number | undefined,
    openWindow: (
      sessionId: string,
      windowId: number,
      options?: OpenWindowOptions
    ) => Promise<void>,
    openTab: (
      sessionId: string,
      windowId: number,
      tabId: number,
      options?: OpenTabOptions
    ) => Promise<void>,
    duplicateTabUrls: string[] | undefined

  const handleWindowClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> =
    async (ev) => {
      const button = ev.currentTarget
      if (button.dataset.windowId) {
        const windowId: number | undefined = parseInt(button.dataset.windowId)
        const ariaDisabled = button.getAttribute('aria-disabled') === 'true'
        if (windowId && !ariaDisabled) {
          await openWindow(
            sessionId,
            windowId,
            // middle-click
            { noFocus: ev.button === 1 }
          )
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
          const ariaDisabled = anchor.getAttribute('aria-disabled') === 'true'
          if (!ariaDisabled) {
            await openTab(sessionId, windowId, tabId)
          }
        }
      }
    }
</script>

<div role="region" aria-labelledby={ariaLabelledby}>
  {#each windows as { id: windowId, tabs, incognito, state }, windowIndex (windowId)}
    <div class={cn(windowIndex !== 0 && 'mt-4')}>
      <div
        class={cn(
          'flex flex-row items-center justify-between py-3 xl:justify-start',
          currentWindowId === windowId
            ? 'text-green-500'
            : incognito
            ? 'text-purple-600'
            : state === 'minimized' && 'text-yellow-600'
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
              data-minimized={state === 'minimized'}
              on:click={handleWindowClick}
              on:auxclick={handleWindowClick}
              aria-disabled={currentWindowId === windowId}
              class="overflow-ellipsis overflow-hidden m-outline"
            >
              {#if currentWindowId === windowId}Current{' '}{/if}Window
            </button>
            {#if currentWindowId === windowId}
              <span class="ml-2" aria-label="active" title="active"
                ><Focused /></span
              >
            {/if}
          </h2>
        </div>
        {#if tabs}
          <div
            class="flex items-center text-gray-500 font-extralight whitespace-nowrap overflow-ellipsis overflow-hidden"
          >
            {#if incognito}
              <span
                class="mr-2 text-purple-600"
                title="incognito"
                aria-label="incognito"
              >
                <Incognito />
              </span>
            {/if}
            {#if state === 'minimized'}
              <span
                class="mr-2 text-yellow-600"
                title="minimized"
                aria-label="minimized"
              >
                <Minimize />
              </span>
            {/if}
            {tabs.length} tabs
          </div>
        {/if}
      </div>
      {#if tabs}
        <ol role="grid" class="overflow-hidden">
          {#each tabs as { id: tabId, windowId, title, pendingUrl, url, favIconUrl, pinned } (tabId)}
            {#if title || url || pendingUrl}
              <li role="row" class="flex flex-row">
                <div
                  class="flex justify-center items-center h-5 w-5 min-w-5 mb-1 mr-3"
                >
                  {#if favIconUrl}
                    <img use:replaceImageError src={favIconUrl} alt={title} />
                  {/if}
                </div>
                <div
                  role="gridcell"
                  class={cn(
                    'leading-5 inline-flex items-center',
                    'overflow-hidden whitespace-pre',
                    tabId === currentTabId && 'text-green-500',
                    duplicateTabUrls && // TODO: accessible attribute to indicate highlighted?
                      (url || pendingUrl) &&
                      duplicateTabUrls.includes(url || pendingUrl || '') &&
                      'bg-yellow-100'
                  )}
                >
                  {#if url || pendingUrl}
                    <a
                      data-context-id={contextIds.TAB}
                      data-session-id={sessionId}
                      data-window-id={windowId}
                      data-tab-id={tabId}
                      data-pinned={pinned}
                      href={url || pendingUrl}
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
                        {url || pendingUrl}
                      {/if}
                    </a>
                  {:else}
                    <span>
                      {title}
                    </span>
                  {/if}
                  {#if pinned}
                    <span
                      class="ml-2 text-red-400"
                      aria-label="pinned"
                      title="pinned"><Pin /></span
                    >
                  {/if}
                  {#if tabId === currentTabId}
                    <span class="ml-2" aria-label="active" title="active"
                      ><Focused /></span
                    >
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
