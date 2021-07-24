<script lang="ts">
  /**
   * @accessibility Use accordion accessibility
   * https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html
   */
  import type { SessionLists } from 'src/utils/browser/storage'
  import ViewButton from './view-button.svelte'
  import WindowList from './window-list.svelte'
  import SessionActions from './actions.svelte'

  export let onSelectSession: svelte.JSX.MouseEventHandler<HTMLButtonElement>,
    onToggleSession: svelte.JSX.MouseEventHandler<HTMLButtonElement>,
    selectedSessionId: string | undefined,
    sessionLists: SessionLists,
    currentWindowId: number | undefined,
    currentTabId: number | undefined,
    openSession: (id: string) => void,
    deleteSession: (id: string) => void

  $: selectedSession = [
    sessionLists.current,
    ...sessionLists.previous,
    ...sessionLists.saved,
  ].find(({ id }) => id === selectedSessionId)
  $: console.log('sessionLists', sessionLists)
</script>

<section class="w-full lg:grid lg:gap-10 lg:grid-cols-12 lg:px-4">
  <menu
    id="menu"
    class="relative p-0 m-0 lg:col-span-4 xl:col-span-3 z-menu-accordion"
  >
    {#each [sessionLists.current, ...sessionLists.previous] as session, i (session.id)}
      <ViewButton
        onClick={onToggleSession}
        onContextMenu={onSelectSession}
        title={i === 0 ? 'Current' : undefined}
        {session}
        selected={selectedSessionId ? selectedSessionId === session.id : false}
        date={session.id === sessionLists.current.id
          ? session.lastModifiedDate
          : session.lastSavedDate}
        datePrefix={session.id === sessionLists.current.id
          ? 'updated'
          : 'created'}
      />
      {#if selectedSessionId === session.id}
        <div class="lg:hidden p-4 xs:px-6 sm:px-10 py-4">
          <div class="flex justify-end">
            <SessionActions
              sessionId={session.id}
              openSession={i !== 0 ? openSession : undefined}
              deleteSession={i !== 0 ? deleteSession : undefined}
            />
          </div>
          <WindowList
            current={i === 0}
            windows={session.windows}
            ariaLabelledby={session.id}
            {currentWindowId}
            {currentTabId}
          />
        </div>
      {/if}

      {#if i === 0 && sessionLists.previous.length > 0}
        <h2 class="p-4 xs:px-6 sm:px-10 pt-8 pb-4 lg:px-6">Previous</h2>
      {/if}
    {/each}

    {#if sessionLists.saved.length > 0}
      <h2 class="p-4 xs:px-6 sm:px-10 pt-8 pb-4 lg:px-6">Saved</h2>

      {#each sessionLists.saved as session}
        <ViewButton
          onClick={onToggleSession}
          onContextMenu={onSelectSession}
          title="Current"
          {session}
          selected={selectedSessionId
            ? selectedSessionId === session.id
            : false}
          date={session.lastModifiedDate}
          datePrefix="created"
        />
        {#if selectedSessionId === session.id}
          <div class="lg:hidden px-4 xs:px-10 py-4">
            <WindowList
              current={false}
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
    <article
      class="scroll hidden lg:block lg:col-span-8 xl:col-span-9 pb-10 h-main overflow-y-auto"
    >
      <div class="flex justify-end">
        <SessionActions
          sessionId={selectedSession.id}
          openSession={selectedSession.id !== sessionLists.current.id
            ? openSession
            : undefined}
          deleteSession={selectedSession.id !== sessionLists.current.id
            ? deleteSession
            : undefined}
        />
      </div>
      <WindowList
        current={selectedSession.id === sessionLists.current.id}
        windows={selectedSession.windows}
        ariaLabelledby={selectedSession.id}
        {currentWindowId}
        {currentTabId}
      />
    </article>
  {/if}
</section>
