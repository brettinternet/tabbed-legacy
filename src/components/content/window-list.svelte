<script lang="ts">
  import cn from 'classnames'

  import { focusWindowTab } from 'src/utils/browser/query'
  import Window from 'src/components/icons/window.svelte'

  export let windows: browser.windows.Window[], ariaLabelledby: string

  const handleTabLinkClick = async (ev: MouseEvent) => {
    const anchor = ev.currentTarget as HTMLAnchorElement
    const ariaDisabled = anchor.getAttribute('aria-disabled') === 'true'
    const tabId: number | undefined = parseInt(anchor.dataset.id)
    const windowId: number | undefined = parseInt(anchor.dataset.windowId)
    if (tabId && windowId) {
      ev.preventDefault()
      if (!ariaDisabled) {
        await focusWindowTab(windowId, tabId)
      }
    }
  }

  let currentWindowId = windows[0].id
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
          <h2 class="font-semibold">
            {#if currentWindowId === id}
              Current
            {/if}
            Window
          </h2>
        </div>
        <div class="text-gray-500 font-extralight">
          {tabs.length} tabs
        </div>
      </div>
      {#each tabs as { id, windowId, title, url, favIconUrl, active }}
        {#if title || url}
          <div class="flex flex-row mb-1">
            {#if favIconUrl}
              <img src={favIconUrl} alt={title} class="mr-3 h-5 w-5" />
            {:else}
              <div class="mr-3 h-5 w-5" />
            {/if}
            <div class="leading-5">
              {#if url}
                <a
                  data-id={id}
                  data-window-id={windowId}
                  href={url}
                  on:click={handleTabLinkClick}
                  class={cn(!(i === 0 && active) && 'hover:underline')}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={i === 0 && active}
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
              {#if i === 0 && active}
                <span class="font-bold"> (current)</span>
              {/if}
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {/each}
</div>
