<script lang="ts">
  /**
   * @accessibility Use accordion accessibility
   * https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html
   */
  import cn from 'classnames'

  import type { SessionLists } from 'src/utils/browser/storage'
  import { sessionType } from 'src/utils/browser/storage'
  import Down from 'src/components/icons/down.svelte'
  import type { OpenTabOptions, OpenWindowOptions } from 'src/utils/messages'
  import ViewButton from './view-button.svelte'
  import WindowList from './window-list.svelte'
  import SessionControl from './control.svelte'
  import Meta from './meta.svelte'

  export let onSelectSession: svelte.JSX.MouseEventHandler<HTMLButtonElement>,
    onToggleSession: svelte.JSX.MouseEventHandler<HTMLButtonElement>,
    selectedSessionId: string | undefined,
    sessionLists: SessionLists,
    currentWindowId: number | undefined,
    currentTabId: number | undefined,
    openSession: (sessionId: string) => Promise<void>,
    saveSession: (sessionId: string) => Promise<void>,
    deleteSession: (sessionId: string) => Promise<void>,
    renameSession: (sessionId: string, name: string) => Promise<void>,
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
    ) => Promise<void>

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
    viewAllPrevious ? sessionLists.previous.length + 1 : limit
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
            windows={session.windows}
            sessionId={session.id}
            ariaLabelledby={session.id}
            {currentWindowId}
            {currentTabId}
            {openWindow}
            {openTab}
          />
        </div>
      {/if}

      {#if i === 0 && sessionLists.previous.length > 0}
        <h2 class="p-4 xs:px-6 sm:px-10 pt-8 pb-4 lg:px-6">Previous</h2>
      {/if}
    {/each}
    {#if sessionLists.previous.length - 1 > limit}
      <div class="flex justify-end px-2 xs:px-4 sm:px-8">
        <button
          class="p-2 flex items-center text-gray-400 dark:text-gray-500"
          on:click={toggleViewAll}
          >{viewAllPrevious
            ? 'less'
            : `${sessionLists.previous.length + 1 - limit} more`}
          <span class={cn('ml-1', viewAllPrevious && 'transform rotate-180')}
            ><Down /></span
          >
        </button>
      </div>
    {/if}

    {#if sessionLists.saved.length > 0}
      <h2 class="p-4 xs:px-6 sm:px-10 pt-8 pb-4 lg:px-6">Saved</h2>

      {#each sessionLists.saved as session (session.id)}
        <ViewButton
          onClick={onToggleSession}
          onContextMenu={onSelectSession}
          title={session.title}
          {session}
          selected={selectedSessionId
            ? selectedSessionId === session.id
            : false}
          date={session.userSavedDate || session.lastModifiedDate}
          datePrefix="saved"
        />
        {#if selectedSessionId === session.id}
          <div class="lg:hidden p-4 xs:px-6 sm:px-10 py-4">
            <SessionControl
              {session}
              {openSession}
              {saveSession}
              {deleteSession}
              {renameSession}
            />
            <WindowList
              windows={session.windows}
              sessionId={session.id}
              ariaLabelledby={session.id}
              {currentWindowId}
              {currentTabId}
              {openWindow}
              {openTab}
            />
          </div>
        {/if}
      {/each}
    {/if}
  </menu>

  {#if selectedSession && selectedSession.id === selectedSessionId}
    <article
      class="scroll hidden lg:col-span-8 xl:col-span-9 pb-10 h-main overflow-y-auto lg:flex lg:flex-col"
    >
      <div class="flex-1">
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
          windows={selectedSession.windows}
          sessionId={selectedSession.id}
          ariaLabelledby={selectedSession.id}
          {currentWindowId}
          {currentTabId}
          {openWindow}
          {openTab}
        />
      </div>
      <div class="mt-8">
        <Meta session={selectedSession} />
      </div>
    </article>
  {/if}
</section>
