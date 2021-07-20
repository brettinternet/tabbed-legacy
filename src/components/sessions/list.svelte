<script lang="ts">
  /**
   * @note Use accordion accessibility
   * https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html
   */
  import type { SessionLists } from 'src/utils/browser/storage'
  import ViewButton from './view-button.svelte'
  import WindowList from './window-list.svelte'

  export let onSelectSession: svelte.JSX.MouseEventHandler<HTMLButtonElement>,
    selectedSessionId: string | undefined,
    sessionLists: SessionLists,
    currentWindowId: number | undefined,
    currentTabId: number | undefined

  const previousCount = sessionLists.previous.length
  const savedCount = sessionLists.saved.length
</script>

<section class="w-full md:grid md:gap-6 md:grid-cols-12 md:px-4">
  <menu
    id="menu"
    class="relative p-0 m-0 md:col-span-3 2xl:col-span-2 z-menu-accordion"
  >
    {#if sessionLists.current}
      <ViewButton
        onClick={onSelectSession}
        title="Current"
        session={sessionLists.current}
        selected={selectedSessionId
          ? selectedSessionId === sessionLists.current.id
          : false}
      />
    {/if}

    {#if selectedSessionId === sessionLists.current.id}
      <div class="md:hidden px-4 xs:px-10 py-4">
        <WindowList
          windows={sessionLists.current.windows}
          ariaLabelledby={selectedSessionId}
          {currentWindowId}
          {currentTabId}
        />
      </div>
    {/if}

    {#if previousCount > 0}
      <h2 class="px-10 py-6">
        Previous<span class="hidden md:inline">{' '}Sessions</span>
      </h2>
    {/if}

    {#if savedCount > 0}
      <h2 class="px-10 py-6">
        Saved<span class="hidden lg:inline">{' '}Sessions</span>
      </h2>
    {/if}
  </menu>
  {#if selectedSessionId === sessionLists.current.id}
    <article class="hidden md:block md:col-span-9 2xl:col-span-10 pb-10">
      <WindowList
        windows={sessionLists.current.windows}
        ariaLabelledby={selectedSessionId}
        {currentWindowId}
        {currentTabId}
      />
    </article>
  {/if}
</section>
