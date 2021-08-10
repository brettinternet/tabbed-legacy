<script lang="ts">
  import cn from 'classnames'

  import { getTabUrl } from 'src/utils/browser/query'
  import { replaceImageError } from 'src/components/sessions/dom'
  import { contextIds } from 'src/components/context-menu/store'
  import Focused from 'src/components/icons/eye.svelte'
  import Pin from 'src/components/icons/pin.svelte'

  export let tab: browser.tabs.Tab,
    sessionId: string | undefined,
    activeTabId: number | undefined,
    onClickAnchor: svelte.JSX.MouseEventHandler<HTMLAnchorElement>,
    duplicateTabUrls: string[] | undefined

  const url = getTabUrl(tab)
  const { id, title, pinned, favIconUrl, windowId } = tab
</script>

{#if title || url}
  <li role="row" class="flex flex-row">
    <div class="flex justify-center items-center h-5 w-5 min-w-5 mb-1 mr-3">
      {#if favIconUrl}
        <img use:replaceImageError src={favIconUrl} alt={title} />
      {/if}
    </div>
    <div
      role="gridcell"
      class={cn(
        'leading-5 inline-flex items-center',
        'overflow-hidden whitespace-pre',
        id === activeTabId && 'text-green-500',
        duplicateTabUrls && // TODO: accessible attribute to indicate highlighted?
          url &&
          duplicateTabUrls.includes(url || '') &&
          'bg-yellow-100 dark:bg-yellow-800'
      )}
    >
      {#if url}
        <a
          data-context-id={contextIds.TAB}
          data-session-id={sessionId}
          data-window-id={windowId}
          data-tab-id={id}
          data-pinned={pinned}
          href={url}
          on:click={onClickAnchor}
          class={cn(
            'overflow-ellipsis overflow-hidden mx-outline',
            id !== activeTabId && 'hover:underline'
          )}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={id === activeTabId}
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
      {#if pinned}
        <span class="ml-2 text-red-400" aria-label="pinned" title="pinned"
          ><Pin /></span
        >
      {/if}
      {#if id === activeTabId}
        <span class="ml-2" aria-label="active" title="active"><Focused /></span>
      {/if}
    </div>
  </li>
{/if}
