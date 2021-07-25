<script lang="ts">
  /**
   * @accessibility Use accordion accessibility
   * https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html
   */
  import type { SessionLists } from 'src/utils/browser/storage'
  import { sessionType } from 'src/utils/browser/storage'
  import ViewButton from './view-button.svelte'
  import WindowList from './window-list.svelte'
  import SessionControl from './control.svelte'

  export let onSelectSession: svelte.JSX.MouseEventHandler<HTMLButtonElement>,
    onToggleSession: svelte.JSX.MouseEventHandler<HTMLButtonElement>,
    selectedSessionId: string | undefined,
    sessionLists: SessionLists,
    currentWindowId: number | undefined,
    currentTabId: number | undefined,
    openSession: (sessionId: string) => void,
    saveSession: (sessionId: string) => void,
    deleteSession: (sessionId: string) => void,
    renameSession: (sessionId: string, name: string) => void

  $: selectedSession = [
    sessionLists.current,
    ...sessionLists.previous,
    ...sessionLists.saved,
  ].find(({ id }) => id === selectedSessionId)

  let viewAllPrevious = false
  const limit = 5

  const toggleViewAll = () => {
    viewAllPrevious = !viewAllPrevious
  }

  $: unsavedSessions = [sessionLists.current, ...sessionLists.previous].slice(
    0,
    viewAllPrevious ? sessionLists.previous.length : limit
  )
</script>

<section class="w-full lg:grid lg:gap-10 lg:grid-cols-12 lg:px-4">
  <menu
    id="menu"
    class="scroll relative p-0 m-0 lg:col-span-4 xl:col-span-3 z-menu-accordion lg:h-main lg:overflow-y-auto"
  >
    {#each unsavedSessions as session, i (session.id)}
      <ViewButton
        onClick={onToggleSession}
        onContextMenu={onSelectSession}
        title={i === 0 ? 'Current' : undefined}
        {session}
        selected={selectedSessionId ? selectedSessionId === session.id : false}
        date={session.id === sessionLists.current.id
          ? session.lastModifiedDate
          : session.createdDate}
        datePrefix={session.id === sessionLists.current.id
          ? 'updated'
          : 'created'}
      />
      {#if selectedSessionId === session.id}
        <div class="lg:hidden p-4 xs:px-6 sm:px-10 py-4">
          <SessionControl
            {session}
            openSession={i !== 0 ? openSession : undefined}
            {saveSession}
            deleteSession={i !== 0 ? deleteSession : undefined}
          />
          <WindowList
            current={i === 0}
            windows={session.windows}
            sessionId={session.id}
            ariaLabelledby={session.id}
            {currentWindowId}
            {currentTabId}
          />
        </div>
      {/if}

      {#if i === 0 && sessionLists.previous.length - 1 > limit}
        <h2 class="p-4 xs:px-6 sm:px-10 pt-8 pb-4 lg:px-6">Previous</h2>
      {/if}
    {/each}
    {#if sessionLists.previous.length > 4}
      <div class="flex justify-end px-2 xs:px-4 sm:px-8">
        <button
          class="p-2 flex items-center text-gray-400 dark:text-gray-600"
          on:click={toggleViewAll}
          >view {viewAllPrevious
            ? 'less'
            : `${sessionLists.previous.length - 1 - limit} more`}</button
        >
      </div>
    {/if}

    {#if sessionLists.saved.length > 0}
      <h2 class="p-4 xs:px-6 sm:px-10 pt-8 pb-4 lg:px-6">Saved</h2>

      {#each sessionLists.saved as session}
        <ViewButton
          onClick={onToggleSession}
          onContextMenu={onSelectSession}
          title={session.title}
          {session}
          selected={selectedSessionId
            ? selectedSessionId === session.id
            : false}
          date={session.createdDate}
          datePrefix="created"
        />
        {#if selectedSessionId === session.id}
          <div class="lg:hidden px-4 xs:px-10 py-4">
            <SessionControl
              {session}
              {openSession}
              {saveSession}
              {deleteSession}
              {renameSession}
            />
            <WindowList
              current={false}
              windows={session.windows}
              sessionId={session.id}
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
      <SessionControl
        session={selectedSession}
        openSession={selectedSession.id !== sessionLists.current.id
          ? openSession
          : undefined}
        {saveSession}
        deleteSession={selectedSession.id !== sessionLists.current.id
          ? deleteSession
          : undefined}
        renameSession={selectedSession.type === sessionType.SAVED
          ? renameSession
          : undefined}
      />
      <WindowList
        current={selectedSession.id === sessionLists.current.id}
        windows={selectedSession.windows}
        sessionId={selectedSession.id}
        ariaLabelledby={selectedSession.id}
        {currentWindowId}
        {currentTabId}
      />
    </article>
  {/if}
</section>
