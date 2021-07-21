<script lang="ts">
  /**
   * @note Use accordion accessibility
   * https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html
   */
  import type { SessionLists } from 'src/utils/browser/storage'
  import ViewButton from './view-button.svelte'
  import WindowList from './window-list.svelte'
  import SessionActions from './actions.svelte'

  export let onSelectSession: svelte.JSX.MouseEventHandler<HTMLButtonElement>,
    selectedSessionId: string | undefined,
    sessionLists: SessionLists,
    currentWindowId: number | undefined,
    currentTabId: number | undefined,
    openSession: (id: string) => void,
    deleteSession: (id: string) => void

  $: selectedSession = [sessionLists.current, ...sessionLists.previous, ...sessionLists.saved].find(({id}) => id === selectedSessionId)
  $: console.log('sessionLists', sessionLists);
</script>

<section class="w-full md:grid md:gap-6 md:grid-cols-12 md:px-4">
  <menu
    id="menu"
    class="relative p-0 m-0 md:col-span-3 2xl:col-span-2 z-menu-accordion"
  >
    {#each [sessionLists.current, ...sessionLists.previous] as session, i (session.id)}
      <ViewButton
        onClick={onSelectSession}
        title={i === 0 ? 'Current' : undefined}
        {session}
        selected={selectedSessionId ? selectedSessionId === session.id : false}
        date={session.lastModifiedDate}
        datePrefix="created"
      />
      {#if selectedSessionId === session.id}
        <div class="md:hidden px-4 xs:px-10 py-4">
          <div class="flex justify-end">
            <SessionActions
              sessionId={session.id}
              openSession={i !== 0 ? openSession : undefined}
              deleteSession={i !== 0 ? deleteSession : undefined}
            />
          </div>
          <WindowList
            windows={session.windows}
            ariaLabelledby={session.id}
            {currentWindowId}
            {currentTabId}
          />
        </div>
      {/if}

      {#if i === 0 && sessionLists.previous.length > 0}
        <h2 class="px-10 py-6">
          Previous<span class="hidden md:inline">{' '}Sessions</span>
        </h2>
      {/if}
    {/each}

    {#if sessionLists.saved.length > 0}
      <h2 class="px-10 py-6">
        Saved<span class="hidden lg:inline">{' '}Sessions</span>
      </h2>

      {#each sessionLists.saved as session}
        <ViewButton
          onClick={onSelectSession}
          title="Current"
          {session}
          selected={selectedSessionId
            ? selectedSessionId === session.id
            : false}
          date={session.lastModifiedDate}
          datePrefix="created"
        />
        {#if selectedSessionId === session.id}
          <div class="md:hidden px-4 xs:px-10 py-4">
            <WindowList
              windows={session.windows}
              ariaLabelledby={session.id}
              {currentWindowId}
              {currentTabId}
            />
          </div>
        {/if}
      {/each}
    {/if}
  </menu>

  {#if selectedSession && selectedSession.id === selectedSessionId}
    <article class="hidden md:block md:col-span-9 2xl:col-span-10 pb-10">
      <WindowList
        windows={selectedSession.windows}
        ariaLabelledby={selectedSession.id}
        {currentWindowId}
        {currentTabId}
      />
    </article>
  {/if}
</section>
