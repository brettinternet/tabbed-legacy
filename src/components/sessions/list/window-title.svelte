<script lang="ts">
  import cn from 'classnames'

  import { contextIds } from 'src/components/context-menu/store'
  import Window from 'src/components/icons/window.svelte'
  import Focused from 'src/components/icons/eye.svelte'
  import Incognito from 'src/components/icons/eye-closed.svelte'
  import Minimize from 'src/components/icons/minimize.svelte'

  export let onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement>,
    sessionId: string | undefined,
    win: browser.windows.Window,
    currentWindowId: number | undefined

  const { id, tabs, incognito, state } = win
</script>

<div
  class={cn(
    'flex flex-row items-center justify-between py-3 lg:justify-start',
    currentWindowId === id
      ? 'text-green-500'
      : incognito
      ? 'text-purple-600'
      : state === 'minimized' && 'text-yellow-600'
  )}
>
  <div class="flex flex-row items-center mr-3 leading-5">
    <div class="flex justify-center w-5 mr-3"><Window /></div>
    <h2 class="font-semibold flex items-center overflow-hidden whitespace-pre">
      <button
        data-context-id={contextIds.WINDOW}
        data-session-id={sessionId}
        data-window-id={id}
        data-minimized={state === 'minimized'}
        on:click={onClick}
        on:auxclick={onClick}
        aria-disabled={currentWindowId === id}
        class="overflow-ellipsis overflow-hidden m-outline"
      >
        {#if currentWindowId === id}Current{' '}{/if}Window
      </button>
      {#if currentWindowId === id}
        <span class="ml-2" aria-label="active" title="active"><Focused /></span>
      {/if}
    </h2>
  </div>
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
    {#if tabs}
      {tabs.length} tabs
    {/if}
  </div>
</div>
