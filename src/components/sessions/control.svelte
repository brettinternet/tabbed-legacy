<script lang="ts">
  /**
   * @accessibility Potentially best to keep aria-label and text identical and use both attributes
   * https://www.deque.com/blog/text-links-practices-screen-readers/
   */
  import { locale } from 'svelte-i18n'
  import { formatDistanceToNow } from 'date-fns'
  import cn, { Argument as ClassnamesArgument } from 'classnames'

  import { getDateLocale } from 'src/i18n'
  import { editSession } from 'src/components/sessions/store'
  import type { Session } from 'src/utils/browser/storage'
  import type { DownloadSessionsOptions } from 'src/utils/messages'
  import Open from 'src/components/icons/open.svelte'
  import Save from 'src/components/icons/save.svelte'
  import Bin from 'src/components/icons/bin.svelte'
  import Edit from 'src/components/icons/edit.svelte'
  import Download from 'src/components/icons/download.svelte'

  export let session: Session,
    deleteSession: OptionalProp<(sessionId: string) => Promise<void>> =
      undefined,
    saveSession: OptionalProp<(sessionId: string) => Promise<void>> = undefined,
    openSession: OptionalProp<(sessionId: string) => Promise<void>> = undefined,
    openSessionEditor: OptionalProp<() => void> = undefined,
    downloadSessions: (options: DownloadSessionsOptions) => Promise<void>,
    rootClassNames: OptionalProp<ClassnamesArgument> = undefined

  const handleOpenSessionEditor = () => {
    if (openSessionEditor) {
      $editSession = session
      openSessionEditor()
    }
  }

  const getDateStr = (date: Date, prefix?: string) => {
    const timeStr = formatDistanceToNow(date, {
      locale: getDateLocale($locale),
      addSuffix: true,
    })
    return prefix ? `${prefix} ${timeStr}` : timeStr
  }

  const createdDate = new Date(session.createdDate)
  const buttonClassName = 'px-3 py-2'
</script>

<div
  class={cn(
    'flex justify-between items-center h-9 bg-gray-100 dark:bg-gray-800',
    'pr-4 xs:pr-6 sm:pr-10 lg:pr-3 pl-2 xs:pl-4 sm:pl-8 lg:pl-2 py-2 lg:py-0',
    rootClassNames
  )}
>
  <div class="flex items-center">
    {#if openSession}
      <button
        class={buttonClassName}
        aria-label="Open session"
        title="Open session"
        on:click={() => {
          if (openSession) {
            void openSession(session.id)
          }
        }}
      >
        <Open />
      </button>
    {/if}
    {#if saveSession}
      <button
        class={buttonClassName}
        aria-label="Save session"
        title="Save session"
        on:click={() => {
          if (saveSession) {
            void saveSession(session.id)
          }
        }}
      >
        <Save />
      </button>
    {/if}
    {#if deleteSession}
      <button
        class={buttonClassName}
        aria-label="Delete session"
        title="Delete session"
        on:click={() => {
          if (deleteSession) {
            void deleteSession(session.id)
          }
        }}
      >
        <Bin />
      </button>
    {/if}
    <button
      class={buttonClassName}
      aria-label="Download session"
      title="Download session"
      on:click={() => {
        void downloadSessions({ sessionIds: session.id })
      }}
    >
      <Download />
    </button>

    {#if openSessionEditor}
      <button
        class={cn('flex flex-row items-center max-w-xs', buttonClassName)}
        aria-label="Edit session"
        title="Edit session"
        on:click={handleOpenSessionEditor}
      >
        <span class={cn(session.title && 'lg:mr-2')}><Edit /></span>
        {#if session.title}
          <span class="hidden lg:inline">
            {session.title}
          </span>
        {/if}
      </button>
    {/if}
  </div>

  <div class="hidden xs:block text-gray-400 dark:text-gray-500">
    <time>{getDateStr(createdDate, 'created')}</time>
  </div>
</div>
