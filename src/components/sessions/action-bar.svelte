<script lang="ts">
  /**
   * @accessibility Potentially best to keep aria-label and text identical and use both attributes
   * https://www.deque.com/blog/text-links-practices-screen-readers/
   */
  import { formatDistanceToNow } from 'date-fns'
  import cn, { Argument as ClassnamesArgument } from 'classnames'

  import type { Session } from 'src/utils/browser/storage'
  import type { DownloadSessionsOptions } from 'src/utils/messages'
  import { locale, getDateLocale } from 'src/utils/i18n'
  import { editSession } from 'src/components/sessions/store'
  import Open from 'src/components/icons/open.svelte'
  import Save from 'src/components/icons/save.svelte'
  import Bin from 'src/components/icons/bin.svelte'
  import Edit from 'src/components/icons/edit.svelte'
  import Download from 'src/components/icons/download.svelte'
  import Button from 'src/components/button/button.svelte'

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
      locale: getDateLocale(locale),
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
    'pr-4 xs:pr-6 sm:pr-10 lg:pr-3 pl-2 xs:pl-4 sm:pl-8 lg:pl-2 py-2 lg:py-0 lg:ml-2',
    rootClassNames
  )}
>
  <div class="flex items-center">
    {#if openSession}
      <Button
        class={buttonClassName}
        aria-label="Open session"
        title="Open session"
        onClick={() => {
          if (openSession) {
            void openSession(session.id)
          }
        }}
      >
        <Open />
      </Button>
    {/if}
    {#if saveSession}
      <Button
        class={buttonClassName}
        aria-label="Save session"
        title="Save session"
        onClick={() => {
          if (saveSession) {
            void saveSession(session.id)
          }
        }}
      >
        <Save />
      </Button>
    {/if}
    {#if deleteSession}
      <Button
        class={buttonClassName}
        aria-label="Delete session"
        title="Delete session"
        onClick={() => {
          if (deleteSession) {
            void deleteSession(session.id)
          }
        }}
      >
        <Bin />
      </Button>
    {/if}
    <Button
      class={buttonClassName}
      aria-label="Download session"
      title="Download session"
      onClick={() => {
        void downloadSessions({ sessionIds: session.id })
      }}
    >
      <Download />
    </Button>

    {#if openSessionEditor}
      <Button
        class={cn('flex flex-row items-center max-w-xs', buttonClassName)}
        aria-label="Edit session"
        title="Edit session"
        onClick={handleOpenSessionEditor}
      >
        <span class={cn(session.title && 'lg:mr-2')}><Edit /></span>
        {#if session.title}
          <span class="hidden lg:inline">
            {session.title}
          </span>
        {/if}
      </Button>
    {/if}
  </div>

  <div class="hidden xs:block text-gray-400 dark:text-gray-500">
    <time>{getDateStr(createdDate, 'created')}</time>
  </div>
</div>
