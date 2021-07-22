<script lang="ts">
  /**
   * @accessibility Potentially best to keep aria-label and text identical and use both attributes
   * https://www.deque.com/blog/text-links-practices-screen-readers/
   */
  import Window from 'src/components/icons/window.svelte'
  import Bin from 'src/components/icons/bin.svelte'

  export let sessionId: string,
    deleteSession: ((id: string) => void) | undefined = undefined,
    openSession: ((id: string) => void) | undefined = undefined

  const handleClickOpen: svelte.JSX.MouseEventHandler<HTMLButtonElement> =
    () => {
      if (openSession) {
        void openSession(sessionId)
      }
    }

  const handleClickDelete: svelte.JSX.MouseEventHandler<HTMLButtonElement> =
    () => {
      if (deleteSession) {
        void deleteSession(sessionId)
      }
    }

  const iconButtonClassName = 'px-3 py-2'
</script>

<div class="flex items-center space-x-2">
  {#if openSession}
    <button
      class={iconButtonClassName}
      aria-label="Open session"
      title="Open session"
      on:click={handleClickOpen}
    >
      <Window />
    </button>
  {/if}
  {#if deleteSession}
    <button
      class={iconButtonClassName}
      aria-label="Delete session"
      title="Delete session"
      on:click={handleClickDelete}
    >
      <Bin />
    </button>
  {/if}
</div>
