<script lang="ts">
  import { locale } from 'svelte-i18n'
  import cn from 'classnames'
  import { formatDistanceToNow } from 'date-fns'

  import Window from 'src/components/icons/window.svelte'
  import { getDateLocale } from 'src/i18n'
  import type { Session } from 'src/utils/browser/storage'
  import { onInterval } from 'src/components/sessions/timer'

  export let session: Session,
    onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement>,
    selected: boolean,
    title: OptionalProp<string> = session.title,
    date: OptionalProp<string> = undefined,
    datePrefix: OptionalProp<string> = undefined

  const getDateStr = (date: string | undefined) => {
    const timeStr = date
      ? formatDistanceToNow(new Date(date), {
          locale: getDateLocale($locale),
          addSuffix: true,
        })
      : undefined
    return timeStr ? `${datePrefix} ${timeStr}` : undefined
  }

  let timeAgoStr = getDateStr(date)

  const updateTimeAgoStr = () => {
    timeAgoStr = getDateStr(date)
  }

  onInterval(updateTimeAgoStr, 60000)
</script>

<button
  id={session.id}
  aria-expanded={selected}
  on:click={onClick}
  style="height:70px;"
  class={cn(
    'px-10 py-4 flex justify-between items-center text-left w-full lg:rounded-sm lg:px-6',
    selected
      ? 'bg-blue-600 text-white dark:bg-blue-400 dark:text-gray-900'
      : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-100'
  )}
>
  <div>
    {#if title}
      <h3
        {title}
        class={cn(
          'overflow-ellipsis overflow-hidden whitespace-pre w-full',
          timeAgoStr && 'mb-1',
          selected && 'font-bold'
        )}
      >
        {title}
      </h3>
    {/if}
    {#if timeAgoStr}
      <h3
        title={timeAgoStr}
        class={cn(
          'text-xs overflow-ellipsis overflow-hidden whitespace-pre w-full',
          selected ? 'text-gray-200 dark:text-gray-800' : 'text-gray-400'
        )}
      >
        {timeAgoStr}
      </h3>
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
