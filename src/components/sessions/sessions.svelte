<script lang="ts">
  /**
   * @accessibility Layouts should comply with accessibility standards
   * https://www.w3.org/TR/2017/WD-wai-aria-practices-1.1-20170628/examples/grid/LayoutGrids.html
   */
  import { onDestroy } from 'svelte'

  import { log } from 'src/utils/logger'
  import { layouts } from 'src/utils/settings'
  import type { Layout } from 'src/utils/settings'
  import {
    currentWindowId,
    currentTabId,
    sessionLists,
    selectedSessionId,
    editSession,
    duplicates,
  } from 'src/components/sessions/store'
  import {
    handleHighlightDuplicateTabUrls,
    updateSessions,
    openSessionEditor,
    closeSessionEditor,
    handleOpenSession,
    handleSaveSession,
    handleDeleteSession,
    handleRenameSession,
    handleOpenWindow,
    handleSaveWindow,
    handleRemoveWindow,
    handleOpenTab,
    handleCloseTab,
    handleMinimizeWindow,
    handlePinTab,
    handleDownloadSessions,
    handleToggleSession,
    handleSelectSession,
  } from 'src/components/sessions/handlers'
  import { setupListeners } from 'src/components/sessions/listeners'
  import {
    registerSessionsContextMenu,
    registerWindowContextMenu,
    registerTabContextMenu,
  } from 'src/components/sessions/context-menus'
  import { contextIds, contextMenu } from 'src/components/context-menu/store'
  import { modal } from 'src/components/modal/store'
  import EditModal from './edit-modal.svelte'
  import List from './list/list.svelte'
  import Grid from './grid.svelte'

  const logContext = 'components/sessions/sessions.svelte'

  export let currentLayout: Layout

  const fetch = async () => {
    await updateSessions()

    if (!$selectedSessionId) {
      $selectedSessionId = $sessionLists?.current.id
    }

    const focusedWindow = $sessionLists?.current?.windows.find(
      ({ id, focused }) => focused || id === browser.windows.WINDOW_ID_CURRENT
    )
    $currentWindowId = focusedWindow?.id
    $currentTabId = focusedWindow?.tabs?.find(({ active }) => active)?.id
  }

  void fetch()

  $: if ($sessionLists) {
    const currentSessionId = $sessionLists.current.id
    if (!(currentSessionId in $contextMenu)) {
      registerSessionsContextMenu({
        currentSessionId,
        openSession: handleOpenSession,
        saveSession: handleSaveSession,
        deleteSession: handleDeleteSession,
        downloadSessions: handleDownloadSessions,
        highlightDuplicateTabUrls: handleHighlightDuplicateTabUrls,
        isHighlightDuplicatesActive: !!$duplicates,
      })
    }

    registerWindowContextMenu({
      sessionLists: $sessionLists,
      openWindow: handleOpenWindow,
      saveWindow: handleSaveWindow,
      removeWindow: handleRemoveWindow,
      minimizeWindow: handleMinimizeWindow,
    })

    registerTabContextMenu({
      sessionLists: $sessionLists,
      openTab: handleOpenTab,
      removeTab: handleCloseTab,
      pinTab: handlePinTab,
    })
  }

  onDestroy(() => {
    contextMenu.unregister(contextIds.SESSION)
    contextMenu.unregister(contextIds.WINDOW)
    contextMenu.unregister(contextIds.TAB)
  })

  setupListeners()

  $: log.debug(logContext, `sessionLists:`, $sessionLists)
</script>

{#if $sessionLists}
  {#if currentLayout === layouts.GRID}
    <Grid selectedSessionId={$selectedSessionId} />
  {:else}
    <List
      toggleSession={handleToggleSession}
      selectSession={handleSelectSession}
      selectedSessionId={$selectedSessionId}
      sessionLists={$sessionLists}
      currentWindowId={$currentWindowId}
      currentTabId={$currentTabId}
      openSession={handleOpenSession}
      saveSession={handleSaveSession}
      deleteSession={handleDeleteSession}
      openTab={handleOpenTab}
      openWindow={handleOpenWindow}
      {openSessionEditor}
      downloadSessions={handleDownloadSessions}
      duplicateTabUrls={$duplicates?.urls}
    />
  {/if}

  {#if $modal.sessionEdit && $editSession}
    <EditModal
      close={closeSessionEditor}
      session={$editSession}
      onSubmit={handleRenameSession}
    />
  {/if}
{/if}
