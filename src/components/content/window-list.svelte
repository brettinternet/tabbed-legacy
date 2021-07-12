<script lang="ts">
  import cn from 'classnames'

  import { focusWindowTab } from 'src/utils/browser/query'
  import Window from 'src/components/icons/window.svelte'

  export let windows: browser.windows.Window[], ariaLabelledby: string

  const handleTabLinkClick = async (ev: MouseEvent) => {
    const tabId: number | undefined = parseInt(
      (ev.currentTarget as HTMLAnchorElement).dataset.id
    )
    const windowId: number | undefined = parseInt(
      (ev.currentTarget as HTMLAnchorElement).dataset.windowId
    )
    if (tabId && windowId) {
      ev.preventDefault()
      await focusWindowTab(windowId, tabId)
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
      {#each tabs as { id, windowId, title, url, favIconUrl }}
        {#if title || url}
          <div class="flex flex-row leading-5 mb-1">
            {#if favIconUrl}
              <img src={favIconUrl} alt={title} class="mr-3 h-5 w-5" />
            {:else}
              <div class="mr-3 h-5 w-5" />
            {/if}
            {#if url}
              <a
                data-id={id}
                data-window-id={windowId}
                href={url}
                on:click={handleTabLinkClick}
                class="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
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
          </div>
        {/if}
      {/each}
    </div>
  {/each}
</div>
