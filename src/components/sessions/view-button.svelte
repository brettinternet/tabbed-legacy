<script lang="ts">
  import { locale } from 'svelte-i18n'
  import cn from 'classnames'
  import { formatDistanceToNow } from 'date-fns'

  import { getDateLocale } from 'src/i18n'
  import type { Session } from 'src/utils/browser/storage'

  export let session: Session,
    onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement>,
    selected: boolean,
    title: OptionalProp<string> = session.title

  const timeAgo = formatDistanceToNow(new Date(session.lastModified), {
    locale: getDateLocale($locale),
    addSuffix: true,
  })
</script>

<button
  id={session.id}
  aria-expanded={selected}
  on:click={onClick}
  class={cn(
    'bg-gray-100 px-10 py-4 flex flex-col justify-center w-full lg:rounded-sm text-left',
    selected && 'bg-blue-600 text-white'
  )}
>
  {#if title}
    <h3
      {title}
      class="overflow-ellipsis overflow-hidden whitespace-pre w-full mb-1"
    >
      {title}
    </h3>
  {/if}
  <h3
    title={timeAgo}
    class={cn(
      'text-xs overflow-ellipsis overflow-hidden whitespace-pre w-full',
      selected ? 'text-gray-200' : 'text-gray-600'
    )}
  >
    {timeAgo}
  </h3>
</button>
