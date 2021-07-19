<script lang="ts">
  /**
   * @note Use accordion accessibility
   * https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html
   */
  import { onDestroy } from 'svelte'

  import { getAllWindows, getActiveTabId } from 'src/utils/browser/query'
  import ViewButton from './view-button.svelte'
  import WindowList from './window-list.svelte'
  import {
    currentWindowId,
    currentTabId,
    currentSession,
    selectedSessionId,
  } from './sessions'
  import type { Session } from './sessions'

  const sampleId = '1'

  let previousSessions: Session[]
  const previousCount = 0
  const savedCount = 0

  const fetch = async () => {
    const windows = await getAllWindows({ populate: true }, true)
    console.log('windows: ', windows)
    $currentSession = {
      id: sampleId,
      lastModified: new Date().getTime(),
      windows,
      current: true,
    }

    if (!$selectedSessionId) {
      $selectedSessionId = $currentSession.id
    }

    const windowId = $currentSession?.windows[0].id
    const tabs = $currentSession?.windows[0]?.tabs
    if (windowId && tabs) {
      const tabId = tabs.find(
        ({ active }) => active
      )?.id
      $currentWindowId = windowId
      if (tabId) {
        $currentTabId = tabId
      }
    }
  }

  void fetch()

  const handleClickAccordionItem: svelte.JSX.MouseEventHandler<HTMLButtonElement> = (ev) => {
    $selectedSessionId = $selectedSessionId
      ? undefined
      : ev.currentTarget.id
  }

  const handleActiveTabChange = (info: browser.tabs._OnActivatedActiveInfo) => {
    $currentWindowId = info.windowId
    $currentTabId = info.tabId
    // reorder windows
  }

  const handleFocusWindowChange = async (windowId: number) => {
    console.log('focus change windowId: ', windowId);
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

  $: selectedSession = [
    ...([$currentSession] || []),
    ...(previousSessions || []),
  ].find(session => session && session.id === $selectedSessionId)

  browser.tabs.onActivated.addListener(handleActiveTabChange)
  browser.windows.onFocusChanged.addListener(handleFocusWindowChange)
  browser.windows.onCreated.addListener(fetch)
  browser.windows.onRemoved.addListener(fetch)

  onDestroy(() => {
    browser.tabs.onActivated.removeListener(handleActiveTabChange)
    browser.windows.onFocusChanged.removeListener(handleFocusWindowChange)
    browser.windows.onCreated.removeListener(fetch)
    browser.windows.onRemoved.removeListener(fetch)
  })

  // TODO: move events to new file?
</script>

<section class="w-full md:grid md:gap-6 md:grid-cols-12 md:px-4">
  <menu
    id="menu"
    class="relative p-0 m-0 md:col-span-3 2xl:col-span-2 z-menu-accordion"
  >
    {#if $currentSession}
      <ViewButton
        onClick={handleClickAccordionItem}
        currentSession={$currentSession}
        selectedSessionId={$selectedSessionId}
      />
    {/if}

    {#if $selectedSessionId && selectedSession}
      <div class="md:hidden px-4 xs:px-10 py-4">
        <WindowList
          windows={selectedSession.windows}
          ariaLabelledby={$selectedSessionId}
          currentWindowId={$currentWindowId}
          currentTabId={$currentTabId}
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
  {#if $selectedSessionId && selectedSession}
    <article class="hidden md:block md:col-span-9 2xl:col-span-10 pb-10">
      <WindowList
        windows={selectedSession.windows}
        ariaLabelledby={$selectedSessionId}
        currentWindowId={$currentWindowId}
        currentTabId={$currentTabId}
      />
    </article>
  {/if}
</section>
