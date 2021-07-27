<script lang="ts">
  /**
   * @accessibility Layouts should comply with accessibility standards
   * https://www.w3.org/TR/2017/WD-wai-aria-practices-1.1-20170628/examples/grid/LayoutGrids.html
   */
  import { onDestroy } from 'svelte'

  import { log } from 'src/utils/logger'
  import { layouts } from 'src/utils/settings'
  import type { Layout } from 'src/utils/settings'
  import type {
    UpdateSessionsListMessage,
    OpenTabOptions,
    OpenWindowOptions,
  } from 'src/utils/messages'
  import { MESSAGE_TYPE_UPDATE_SESSIONS_LIST } from 'src/utils/messages'
  import { getActiveTabId } from 'src/utils/browser/query'
  import {
    currentWindowId,
    currentTabId,
    sessionLists,
    selectedSessionId,
    sortCurrentSession,
    getSessions,
    saveExistingSession,
    saveWindow,
    openSession,
    openWindow,
    openTab,
    deleteSession,
    removeWindow,
    removeTab,
    renameSession,
    patchWindow,
    patchTab,
  } from 'src/components/sessions/store'
  import {
    registerSessionsContextMenu,
    registerWindowContextMenu,
    registerTabContextMenu,
  } from 'src/components/sessions/context-menus'
  import { contextIds, contextMenu } from 'src/components/context-menu/store'
  import List from './list.svelte'
  import Grid from './grid.svelte'

  const logContext = 'components/sessions/sessions.svelte'

  export let currentLayout: Layout

  let firstUpdateComplete = false

  const fetch = async () => {
    log.debug(logContext, 'fetch()')

    try {
      $sessionLists = await getSessions()
    } catch (err) {
      log.error(err)
      // TODO: handle error presentation
    }

    if (!$selectedSessionId && !firstUpdateComplete) {
      $selectedSessionId = $sessionLists?.current.id
    }

    const focusedWindow = $sessionLists?.current?.windows.find(
      ({ id, focused }) => focused || id === browser.windows.WINDOW_ID_CURRENT
    )
    $currentWindowId = focusedWindow?.id
    $currentTabId = focusedWindow?.tabs?.find(({ active }) => active)?.id
  }

  void fetch()

  const handleOpenSession = async (sessionId: string) => {
    log.debug(logContext, 'handleOpenSession()', sessionId)

    try {
      await openSession(sessionId)
      $sessionLists = await getSessions()
      $selectedSessionId = sessionId
    } catch (err) {
      log.error(err)
    }
  }

  const handleSaveSession = async (sessionId: string) => {
    log.debug(logContext, 'handleSaveSession()', sessionId)

    try {
      await saveExistingSession(sessionId)
      $sessionLists = await getSessions()
      $selectedSessionId = sessionId
    } catch (err) {
      log.error(err)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    log.debug(logContext, 'handleDeleteSession()', sessionId)

    try {
      await deleteSession(sessionId)
      $sessionLists = await getSessions()
      if ($selectedSessionId === sessionId) {
        $selectedSessionId = undefined
      }
    } catch (err) {
      log.error(err)
    }
  }

  const handleRenameSession = async (sessionId: string, name: string) => {
    log.debug(logContext, 'handleRenameSession()', sessionId)

    try {
      // TODO: name validation here
      await renameSession(sessionId, name)
      $sessionLists = await getSessions()
    } catch (err) {
      log.error(err)
    }
  }

  const handleOpenWindow = async (
    sessionId: string,
    windowId: number,
    options?: OpenWindowOptions
  ) => {
    log.debug(logContext, 'handleOpenWindow()', sessionId, windowId)

    try {
      await openWindow(sessionId, windowId, options)
      $sessionLists = await getSessions()
      $selectedSessionId = sessionId
    } catch (err) {
      log.error(err)
    }
  }

  const handleSaveWindow = async (sessionId: string, windowId: number) => {
    log.debug(logContext, 'handleSaveWindow()', sessionId)

    try {
      await saveWindow(sessionId, windowId)
      $sessionLists = await getSessions()
      $selectedSessionId = sessionId
    } catch (err) {
      log.error(err)
    }
  }

  const handleRemoveWindow = async (sessionId: string, windowId: number) => {
    log.debug(logContext, 'handleRemoveWindow()', sessionId)

    try {
      await removeWindow(sessionId, windowId)
      $sessionLists = await getSessions()
    } catch (err) {
      log.error(err)
    }
  }

  const handleOpenTab = async (
    sessionId: string,
    windowId: number,
    tabId: number,
    options?: OpenTabOptions
  ) => {
    try {
      await openTab(sessionId, windowId, tabId, options)
      $sessionLists = await getSessions()
    } catch (err) {
      log.error(err)
    }
  }

  const handleCloseTab = async (
    sessionId: string,
    windowId: number,
    tabId: number
  ) => {
    try {
      await removeTab(sessionId, windowId, tabId)
      $sessionLists = await getSessions()
    } catch (err) {
      log.error(err)
    }
  }

  const handleMinimizeWindow = async (
    sessionId: string,
    windowId: number,
    minimized: boolean
  ) => {
    try {
      await patchWindow(sessionId, windowId, {
        state: minimized ? 'minimized' : 'normal',
      })
      // TODO: push update from backend only if action isn't on current session
      $sessionLists = await getSessions()
    } catch (err) {
      log.error(err)
    }
  }

  const handlePinTab = async (
    sessionId: string,
    windowId: number,
    tabId: number,
    pinned: boolean
  ) => {
    try {
      await patchTab(sessionId, windowId, tabId, { pinned })
      $sessionLists = await getSessions()
    } catch (err) {
      log.error(err)
    }
  }

  $: if ($sessionLists) {
    const currentSessionId = $sessionLists.current.id
    if (!(currentSessionId in $contextMenu)) {
      registerSessionsContextMenu({
        currentSessionId,
        openSession: handleOpenSession,
        saveSession: handleSaveSession,
        deleteSession: handleDeleteSession,
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

  const updateSessions = (message: UpdateSessionsListMessage) => {
    if (message.type === MESSAGE_TYPE_UPDATE_SESSIONS_LIST) {
      log.debug(logContext, 'updateSessions()', message.value)

      $sessionLists = message.value
    }

    return false // no reply
  }

  browser.runtime.onMessage.addListener(updateSessions)

  const handleToggleSession: svelte.JSX.MouseEventHandler<HTMLButtonElement> = (
    ev
  ) => {
    const nextId = ev.currentTarget.id
    $selectedSessionId = $selectedSessionId === nextId ? undefined : nextId
  }

  const handleSelectSession: svelte.JSX.MouseEventHandler<HTMLButtonElement> = (
    ev
  ) => {
    const nextId = ev.currentTarget.id
    $selectedSessionId = nextId
  }

  const handleActiveTabChange = (info: browser.tabs._OnActivatedActiveInfo) => {
    $currentWindowId = info.windowId
    $currentTabId = info.tabId
  }

  const handleFocusWindowChange = async (activeWindowId: number) => {
    if (activeWindowId > 0) {
      const tabId = await getActiveTabId(activeWindowId)
      $currentWindowId = activeWindowId
      $currentTabId = tabId
      await sortCurrentSession(activeWindowId)
    } else {
      $currentWindowId = undefined
      $currentTabId = undefined
    }
  }

  browser.tabs.onActivated.addListener(handleActiveTabChange)
  browser.windows.onFocusChanged.addListener(handleFocusWindowChange)

  onDestroy(() => {
    contextMenu.unregister(contextIds.SESSION)
    browser.runtime.onMessage.removeListener(updateSessions)
    browser.tabs.onActivated.removeListener(handleActiveTabChange)
    browser.windows.onFocusChanged.removeListener(handleFocusWindowChange)
  })

  $: log.debug(logContext, `sessionLists:`, $sessionLists)
</script>

{#if $sessionLists}
  {#if currentLayout === layouts.GRID}
    <Grid selectedSessionId={$selectedSessionId} />
  {:else}
    <List
      onToggleSession={handleToggleSession}
      onSelectSession={handleSelectSession}
      selectedSessionId={$selectedSessionId}
      sessionLists={$sessionLists}
      currentWindowId={$currentWindowId}
      currentTabId={$currentTabId}
      openSession={handleOpenSession}
      saveSession={handleSaveSession}
      deleteSession={handleDeleteSession}
      renameSession={handleRenameSession}
      openTab={handleOpenTab}
      openWindow={handleOpenWindow}
    />
  {/if}
{/if}
