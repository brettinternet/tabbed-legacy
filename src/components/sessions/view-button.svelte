<script lang="ts">
  import { locale } from 'svelte-i18n'
  import cn from 'classnames'
  import { formatDistanceToNow } from 'date-fns'

  import { getDateLocale } from 'src/i18n'
  import type { Session } from './sessions'

  export let currentSession: Session,
    onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement>,
    selectedSessionId: string | undefined

    const sampleId = '1'
</script>

<button
  id={currentSession.id}
  aria-expanded={(selectedSessionId &&
    selectedSessionId === currentSession.id) ||
    'false'}
  on:click={onClick}
  class={cn(
    'bg-gray-100 px-10 py-6 flex flex-row items-center w-full lg:rounded-sm',
    selectedSessionId === sampleId && 'bg-blue-600 text-white'
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
