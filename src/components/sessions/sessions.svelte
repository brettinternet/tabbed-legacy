<script lang="ts">
  /**
   * @notes Layouts should comply with accessibility standards
   * https://www.w3.org/TR/2017/WD-wai-aria-practices-1.1-20170628/examples/grid/LayoutGrids.html
   */
   import { onDestroy } from 'svelte'

   import { log } from 'src/utils/logger'
  import { layouts } from 'src/utils/settings'
  import type { Layout } from 'src/utils/settings'
  import type { UpdateSessionsListMessage, GetSessionsListMessage, GetSessionsListResponse } from 'src/utils/messages'
  import { MESSAGE_TYPE_UPDATE_SESSIONS_LIST, MESSAGE_TYPE_GET_SESSIONS_LIST } from 'src/utils/messages'
  import { getActiveTabId } from 'src/utils/browser/query'
  import {
    currentWindowId,
    currentTabId,
    sessionLists,
    selectedSessionId,
  } from 'src/components/sessions/store'
  import { deletePreviousSession } from 'src/utils/browser/storage'
  import List from './list.svelte'
  import Grid from './grid.svelte'

  export let currentLayout: Layout

  const logContext = 'components/sessions/sessions.svelte'
  let firstUpdateComplete = false

  const getSessions = async () => {
    log.debug(logContext, 'getSessions()')

    const message: GetSessionsListMessage = {
      type: MESSAGE_TYPE_GET_SESSIONS_LIST
    }

      return await browser.runtime.sendMessage(message) as GetSessionsListResponse

  }

  const fetch = async () => {
    log.debug(logContext, 'fetch()')

    try {
      $sessionLists = await getSessions()
    } catch (err) {
      log.error(err)
      // TODO: handle error presentation
    }

    if (!$selectedSessionId && !firstUpdateComplete) {
      $selectedSessionId = $sessionLists.current.id
    }

    const focusedWindow = $sessionLists.current?.windows.find(({ focused }) => focused)
    $currentWindowId = focusedWindow?.id
    $currentTabId = focusedWindow?.tabs?.find(({ active }) => active)?.id
  }

  void fetch()

  const deleteSession = async (id: string) => {
    log.debug(logContext, 'deleteSession()', id)

    try {
      await deletePreviousSession(id)
      $sessionLists = await getSessions()
    } catch (err) {
      log.error(err)
    }

    if ($selectedSessionId === id) {
      $selectedSessionId = undefined
    }
  }

  const updateSessions = (message: UpdateSessionsListMessage) => {
    if (message.type === MESSAGE_TYPE_UPDATE_SESSIONS_LIST) {
      log.debug(logContext, 'updateSessions', message.value)

      $sessionLists = message.value
    }

    return false // no reply
  }

  console.log('$selectedSessionId', $selectedSessionId)

  browser.runtime.onMessage.addListener(updateSessions)

  const handleSelectSession: svelte.JSX.MouseEventHandler<HTMLButtonElement> = (ev) => {
    const nextId = ev.currentTarget.id
    $selectedSessionId = $selectedSessionId === nextId
      ? undefined
      : nextId
  }

  const handleActiveTabChange = (info: browser.tabs._OnActivatedActiveInfo) => {
    $currentWindowId = info.windowId
    $currentTabId = info.tabId
    // reorder windows
  }

  const handleFocusWindowChange = async (windowId: number) => {
    if (windowId > 0) {
      const tabId = await getActiveTabId(windowId)
      $currentWindowId = windowId
      $currentTabId = tabId
      // reorder windows
    } else {
      $currentWindowId = undefined
      $currentTabId = undefined
    }
  }

  browser.tabs.onActivated.addListener(handleActiveTabChange)
  browser.windows.onFocusChanged.addListener(handleFocusWindowChange)

  onDestroy(() => {
    browser.runtime.onMessage.removeListener(updateSessions)
    browser.tabs.onActivated.removeListener(handleActiveTabChange)
    browser.windows.onFocusChanged.removeListener(handleFocusWindowChange)
  })
</script>

{#if $sessionLists}
  {#if currentLayout === layouts.GRID}
    <Grid selectedSessionId={$selectedSessionId} />
  {:else}
    <List
      onSelectSession={handleSelectSession}
      selectedSessionId={$selectedSessionId}
      sessionLists={$sessionLists}
      currentWindowId={$currentWindowId}
      currentTabId={$currentTabId}
      {deleteSession}
    />
  {/if}
{/if}
