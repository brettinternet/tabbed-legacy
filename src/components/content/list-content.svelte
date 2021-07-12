<script lang="ts">
  /**
   * @note Use accordion accessibility
   * https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html
   */
  import { locale } from 'svelte-i18n'
  import cn from 'classnames'
  import { formatDistanceToNow } from 'date-fns'

  import { getAllWindows } from 'src/utils/browser/query'
  import {getDateLocale} from 'src/i18n'
  import WindowList from './window-list.svelte'
  import type { Session } from './session'

  const sampleId = '1'

  let currentSession: Session
  let previousSessions: Session[]
  const previousCount = 0
  const savedCount = 0

  const fetch = async () => {
    const windows = await getAllWindows({ populate: true }, true)
    currentSession = {
      id: sampleId,
      lastModified: new Date().getTime(),
      windows,
      current: true,
    }
  }

  fetch()

  let selectedSessionId: string = null

  const handleClickAccordionItem = (ev: MouseEvent) => {
    selectedSessionId = selectedSessionId ? null : (ev.currentTarget as HTMLButtonElement).id
  }

  $: selectedSession = [
    ...([currentSession] || []),
    ...(previousSessions || []),
  ].find(session => session && session.id === selectedSessionId)
</script>

<section class="w-full lg:grid lg:gap-6 lg:grid-cols-12 lg:px-4">
  <menu class="p-0 m-0 lg:col-span-3 2xl:col-span-2">
    {#if currentSession}
      <h2 class=" px-10 py-6">
        Current<span class="hidden md:inline">{' '}Session</span>
      </h2>

      <button
        id={currentSession.id}
        aria-expanded={selectedSessionId &&
        selectedSessionId === currentSession.id
          ? 'true'
          : 'false'}
        on:click={handleClickAccordionItem}
        class={cn(
          'bg-gray-100 px-10 py-6 flex flex-row items-center w-full lg:rounded-sm',
          {
            ['bg-blue-600 text-white']: selectedSessionId === sampleId,
          }
        )}
      >
        {#if currentSession.title}
          <h3
            title={currentSession.title}
            class="overflow-ellipsis overflow-hidden whitespace-pre"
          >
            {currentSession.title}
          </h3>
        {:else}
          <h3
            class={cn(
              'text-xs',
              selectedSessionId === sampleId ? 'text-gray-200' : 'text-gray-600'
            )}
          >
            {formatDistanceToNow(new Date(currentSession.lastModified), {
              locale: getDateLocale($locale),
              addSuffix: true,
            })}
          </h3>
        {/if}
      </button>
    {/if}

    {#if selectedSessionId && selectedSession}
      <div class="md:hidden px-10 py-4">
        <WindowList
          windows={selectedSession.windows}
          ariaLabelledby={selectedSessionId}
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
  {#if selectedSessionId && selectedSession}
    <article class="hidden md:block lg:col-span-9 2xl:col-span-10 pb-10">
      <WindowList
        windows={selectedSession.windows}
        ariaLabelledby={selectedSessionId}
      />
    </article>
  {/if}
</section>
