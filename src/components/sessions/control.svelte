<script lang="ts">
  /**
   * @accessibility Potentially best to keep aria-label and text identical and use both attributes
   * https://www.deque.com/blog/text-links-practices-screen-readers/
   */
  import { locale } from 'svelte-i18n'
  import { formatDistanceToNow } from 'date-fns'

  import Window from 'src/components/icons/window.svelte'
  import Save from 'src/components/icons/save.svelte'
  import Bin from 'src/components/icons/bin.svelte'
  import type { Session } from 'src/utils/browser/storage'
  import { getDateLocale } from 'src/i18n'

  export let session: Session,
    deleteSession: OptionalProp<(sessionId: string) => void> = undefined,
    saveSession: OptionalProp<(sessionId: string) => void> = undefined,
    openSession: OptionalProp<(sessionId: string) => void> = undefined,
    renameSession: OptionalProp<(sessionId: string, name: string) => void> =
      undefined

  const getDateStr = (date: Date, prefix?: string) => {
    const timeStr = formatDistanceToNow(date, {
      locale: getDateLocale($locale),
      addSuffix: true,
    })
    return prefix ? `${prefix} ${timeStr}` : timeStr
  }

  const buttonClassName = 'px-3 py-2'
</script>

<div class="flex justify-between items-center">
  <div class="flex items-center space-x-2">
    {#if renameSession}
      <button
        class={buttonClassName}
        aria-label="Rename session"
        title="Rename session"
        on:click={() => {
          console.log('renameSession: ', renameSession)
          if (renameSession) {
            void renameSession(session.id, 'test')
          }
        }}
      >
        {#if session.title}
          {session.title}
        {:else}
          <span class="text-gray-400 dark:text-gray-600 text-xxs">name</span>
        {/if}
      </button>
    {/if}
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
        <Window />
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
    {#if session.lastModifiedDate !== session.createdDate}
      <div class="text-gray-400 dark:text-gray-600">
        <time>{getDateStr(new Date(session.lastModifiedDate), 'updated')}</time>
      </div>
    {/if}
  </div>

  <div class="text-gray-400 dark:text-gray-600">
    <time>{getDateStr(new Date(session.createdDate), 'created')}</time>
  </div>
</div>
