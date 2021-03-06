<script lang="ts">
  /**
   * @accessibility use rows and gridcells
   * https://www.w3.org/TR/2017/WD-wai-aria-practices-1.1-20170628/examples/grid/LayoutGrids.html
   */
  import cn from 'classnames'

  import type { OpenTabOptions, OpenWindowOptions } from 'src/utils/messages'
  import { getTabUrl } from 'src/utils/browser/query'
  import WindowTitle from './window-title.svelte'
  import TabItem from './tab-item.svelte'

  export let windows: browser.windows.Window[],
    ariaLabelledby: string,
    sessionId: string,
    activeWindowId: OptionalProp<number> = undefined,
    activeTabId: OptionalProp<number> = undefined,
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
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
        const isMiddleClick = ev.button === 1
        const isRightClick = ev.button === 2
        const ariaDisabled = button.getAttribute('aria-disabled') === 'true'
        if (!isRightClick && windowId && (isMiddleClick || !ariaDisabled)) {
          await openWindow(sessionId, windowId, { noFocus: isMiddleClick })
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
  {#each windows as win, windowIndex (sessionId + win.id)}
    <div class={cn(windowIndex !== 0 && 'mt-4')}>
      <WindowTitle
        onClick={handleWindowClick}
        {sessionId}
        {win}
        {activeWindowId}
      />
      {#if win.tabs}
        <ol role="grid" class="overflow-hidden">
          {#each win.tabs as tab (sessionId + tab.id + tab.title + getTabUrl(tab) + tab.pinned + tab.windowId)}
            <TabItem
              {tab}
              {sessionId}
              {activeTabId}
              onClickAnchor={handleTabLinkClick}
              {duplicateTabUrls}
            />
          {/each}
        </ol>
      {/if}
    </div>
  {/each}
</div>
