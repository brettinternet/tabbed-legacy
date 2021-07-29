<script lang="ts">
  import { locale } from 'svelte-i18n'
  import cn from 'classnames'
  import { formatDistanceToNow } from 'date-fns'
  import { onDestroy } from 'svelte'

  import Window from 'src/components/icons/window.svelte'
  import { getDateLocale } from 'src/i18n'
  import type { Session } from 'src/utils/browser/storage'
  import { contextIds } from 'src/components/context-menu/store'

  export let session: Session,
    onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement>,
    onContextMenu: svelte.JSX.MouseEventHandler<HTMLButtonElement>,
    selected: boolean,
    title: OptionalProp<string> = session.title,
    date: OptionalProp<string> = undefined,
    datePrefix: OptionalProp<string> = undefined

  const getDateStr = (date: Date) => {
    const timeStr = formatDistanceToNow(date, {
      locale: getDateLocale($locale),
      addSuffix: true,
    })
    return datePrefix ? `${datePrefix} ${timeStr}` : timeStr
  }

  const dateValue = date ? new Date(date) : undefined
  let timeAgoStr: string | undefined, interval: number | undefined

  if (dateValue) {
    const updateTimeAgoStr = () => {
      timeAgoStr = getDateStr(dateValue)
    }

    updateTimeAgoStr()

    const ONE_MINUTE = 60 * 1000
    interval = window.setInterval(updateTimeAgoStr, ONE_MINUTE)
  }

  onDestroy(() => {
    if (interval) {
      clearInterval(interval)
    }
  })
</script>

<button
  data-session-id={session.id}
  data-context-id={contextIds.SESSION}
  data-session-type={session.type}
  aria-expanded={selected}
  on:click={onClick}
  on:contextmenu={onContextMenu}
  style="height:70px;"
  class={cn(
    'p-4 xs:px-6 sm:px-10 py-4 flex justify-between items-center text-left w-full overflow-hidden whitespace-nowrap lg:rounded-sm lg:px-6',
    selected
      ? 'bg-blue-600 text-white dark:bg-blue-400 dark:text-gray-900'
      : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-100'
  )}
>
  <div class="overflow-hidden">
    {#if title}
      <h1
        {title}
        class={cn(
          'overflow-ellipsis overflow-hidden w-full',
          timeAgoStr && 'mb-1',
          selected && 'font-bold'
        )}
      >
        {title}
      </h1>
    {/if}
    {#if timeAgoStr}
      <h2
        title={timeAgoStr}
        class={cn(
          'text-xs overflow-ellipsis overflow-hidden w-full',
          selected ? 'text-gray-200 dark:text-gray-800' : 'text-gray-400'
        )}
      >
        {timeAgoStr}
      </h2>
    {/if}
  </div>

  <div
    class={cn(
      'text-xxs flex flex-row items-center',
      selected
        ? 'text-gray-200 dark:text-gray-800'
        : 'text-gray-400 dark:text-gray-400'
    )}
  >
    <span class="mr-1">{session.windows.length}</span>
    <Window size={10} />
  </div>
</button>
