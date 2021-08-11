<script lang="ts">
  /**
   * @accessibility Use accordion accessibility
   * https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html
   */
  import cn from 'classnames'

  import type { SessionLists } from 'src/utils/browser/storage'
  import { sessionTypes } from 'src/utils/browser/storage'
  import Down from 'src/components/icons/down.svelte'
  import type {
    OpenTabOptions,
    OpenWindowOptions,
    DownloadSessionsOptions,
  } from 'src/utils/messages'
  import { contextIds } from 'src/components/context-menu/store'
  import { modal } from 'src/components/modal/store'
  import Upload from 'src/components/icons/upload.svelte'
  import ViewButton from './view-button.svelte'
  import WindowList from './windows-list.svelte'
  import Meta from './meta.svelte'
  import ActionBar from '../action-bar.svelte'

  export let selectSession: svelte.JSX.MouseEventHandler<HTMLButtonElement>,
    toggleSession: svelte.JSX.MouseEventHandler<HTMLButtonElement>,
    selectedSessionId: string | undefined,
    sessionLists: SessionLists,
    activeWindowId: number | undefined,
    activeTabId: number | undefined,
    openSession: (sessionId: string) => Promise<void>,
    saveSession: (sessionId: string) => Promise<void>,
    deleteSession: (sessionId: string) => Promise<void>,
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
    openSessionEditor: () => void,
    downloadSessions: (options: DownloadSessionsOptions) => Promise<void>,
    duplicateTabUrls: string[] | undefined

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

  const handleOpenImporter = () => {
    modal.importer.set(true)
  }

  $: unsavedSessions = [sessionLists.current, ...sessionLists.previous].slice(
    0,
    viewAllPrevious ? sessionLists.previous.length + 1 : limit
  )
</script>

<section class="w-full lg:grid lg:grid-cols-12 lg:px-4">
  <menu
    id="menu"
    class="scroll relative p-0 m-0 lg:col-span-4 xl:col-span-3 z-menu-accordion lg:h-main lg:overflow-y-auto"
  >
    {#each unsavedSessions as session, i (session.id)}
      <ViewButton
        {toggleSession}
        {selectSession}
        title={i === 0 ? 'Current' : session.title}
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
        <div
          data-context-id={contextIds.SESSION}
          data-session-id={session.id}
          data-session-type={session.type}
        >
          <ActionBar
            {session}
            openSession={i !== 0 ? openSession : undefined}
            {saveSession}
            deleteSession={i !== 0 ? deleteSession : undefined}
            {downloadSessions}
            rootClassNames="block lg:hidden"
          />
          <div class="lg:hidden px-4 pb-4 xs:px-6 sm:px-10">
            <WindowList
              windows={session.windows}
              sessionId={session.id}
              ariaLabelledby={session.id}
              activeWindowId={i === 0 ? activeWindowId : undefined}
              activeTabId={i === 0 ? activeTabId : undefined}
              {openWindow}
              {openTab}
              {duplicateTabUrls}
            />
          </div>
        </div>
      {/if}

      {#if i === 0 && sessionLists.previous.length > 0}
        <h2 class="p-4 xs:px-6 sm:px-10 pt-8 pb-4 lg:px-6">Previous</h2>
      {/if}
    {/each}
    {#if sessionLists.previous.length - 1 > limit}
      <div class="flex justify-end px-2 xs:px-4 sm:px-8 lg:px-4">
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

    <div
      class="flex justify-between items-center pr-1 pt-3 pb-2 xs:pr-3 sm:pr-7 lg:pr-3 pl-4 xs:pl-6 sm:pl-10 lg:pl-6"
    >
      <h2>Saved</h2>
      <button
        on:click={handleOpenImporter}
        class="py-2 px-3"
        aria-label="Upload sessions"
        title="Upload sessions"
      >
        <Upload />
      </button>
    </div>

    {#if sessionLists.saved.length > 0}
      {#each sessionLists.saved as session (session.id)}
        <ViewButton
          {toggleSession}
          {selectSession}
          title={session.title}
          {session}
          selected={selectedSessionId
            ? selectedSessionId === session.id
            : false}
          date={session.userSavedDate || session.lastModifiedDate}
          datePrefix="saved"
        />
        {#if selectedSessionId === session.id}
          <div
            data-context-id={contextIds.SESSION}
            data-session-id={session.id}
            data-session-type={session.type}
          >
            <ActionBar
              {session}
              {openSession}
              {saveSession}
              {deleteSession}
              {openSessionEditor}
              {downloadSessions}
              rootClassNames="block lg:hidden"
            />
            <div class="lg:hidden px-4 pb-4 xs:px-6 sm:px-10">
              <WindowList
                windows={session.windows}
                sessionId={session.id}
                ariaLabelledby={session.id}
                {openWindow}
                {openTab}
                {duplicateTabUrls}
              />
            </div>
          </div>
        {/if}
      {/each}
    {:else}
      <p class="text-gray-500 text-center p-4 xs:px-6 sm:px-10 py-4">None</p>
    {/if}
  </menu>

  {#if selectedSession && selectedSession.id === selectedSessionId}
    <article
      class="hidden lg:col-span-8 xl:col-span-9 h-main lg:flex lg:flex-col"
      data-context-id={contextIds.SESSION}
      data-session-id={selectedSession.id}
      data-session-type={selectedSession.type}
    >
      <ActionBar
        session={selectedSession}
        openSession={selectedSession.id !== sessionLists.current.id
          ? openSession
          : undefined}
        {saveSession}
        deleteSession={selectedSession.id !== sessionLists.current.id
          ? deleteSession
          : undefined}
        openSessionEditor={selectedSession.type === sessionTypes.SAVED
          ? openSessionEditor
          : undefined}
        {downloadSessions}
      />
      <div class="scroll overflow-y-auto pb-6 flex flex-col h-full">
        <div class="flex-1 pl-10">
          <WindowList
            windows={selectedSession.windows}
            sessionId={selectedSession.id}
            ariaLabelledby={selectedSession.id}
            activeWindowId={selectedSession.id === sessionLists.current.id
              ? activeWindowId
              : undefined}
            activeTabId={selectedSession.id === sessionLists.current.id
              ? activeTabId
              : undefined}
            {openWindow}
            {openTab}
            {duplicateTabUrls}
          />
        </div>
        <div class="mt-8 pl-10">
          <Meta session={selectedSession} />
        </div>
      </div>
    </article>
  {/if}
</section>
