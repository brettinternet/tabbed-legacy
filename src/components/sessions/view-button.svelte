<script lang="ts">
  import { locale } from 'svelte-i18n'
  import cn from 'classnames'
  import { formatDistanceToNow } from 'date-fns'

  import { getDateLocale } from 'src/i18n'
  import type { Session } from 'src/utils/browser/storage'

  export let session: Session,
    onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement>,
    selected: boolean,
    title: OptionalProp<string> = session.title,
    date: OptionalProp<string> = undefined,
    datePrefix: OptionalProp<string> = undefined

  const timeAgo = date
    ? formatDistanceToNow(new Date(date), {
        locale: getDateLocale($locale),
        addSuffix: true,
      })
    : undefined

  const timeStr = timeAgo ? `${datePrefix} ${timeAgo}` : undefined
</script>

<button
  id={session.id}
  aria-expanded={selected}
  on:click={onClick}
  style="height:70px;"
  class={cn(
    'px-10 py-4 flex justify-between items-center w-full lg:rounded-sm text-left',
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
          timeAgo && 'mb-1',
          selected && 'font-bold'
        )}
      >
        {title}
      </h3>
    {/if}
    {#if timeAgo}
      <h3
        title={timeStr}
        class={cn(
          'text-xs overflow-ellipsis overflow-hidden whitespace-pre w-full',
          selected ? 'text-gray-200 dark:text-gray-800' : 'text-gray-400'
        )}
      >
        {timeStr}
      </h3>
    {/if}
  </div>

  <div
    class={cn(
      'text-xxs',
      selected
        ? 'text-gray-200 dark:text-gray-800'
        : 'text-gray-400 dark:text-gray-400'
    )}
  >
    {session.windows.length === 1
      ? `${session.windows.length} window`
      : `${session.windows.length} windows`}
  </div>
</button>
