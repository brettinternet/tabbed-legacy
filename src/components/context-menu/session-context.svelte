<script lang="ts">
  import Window from 'src/components/icons/window.svelte'
  import Save from 'src/components/icons/save.svelte'
  import Bin from 'src/components/icons/bin.svelte'
  import ContextMenu from './context-menu.svelte'
  import MenuOption from './option.svelte'
  import { contextIds } from 'src/components/context-menu/store'
  import type { ClickOptionEventHandler } from 'src/components/context-menu/store'

  export let openSession: ((id: string) => void) | undefined = undefined,
    saveSession: ((id: string) => void) | undefined = undefined,
    deleteSession: ((id: string) => void) | undefined = undefined,
    currentSessionId: string

  const handleClickOpen: ClickOptionEventHandler = (ev) => {
    const sessionId = ev.detail.target.id
    if (openSession && sessionId) {
      void openSession(sessionId)
    }
  }

  const handleClickSave = console.log

  const handleClickDelete: ClickOptionEventHandler = (ev) => {
    const sessionId = ev.detail.target.id
    if (deleteSession && sessionId) {
      void deleteSession(sessionId)
    }
  }
</script>

<ContextMenu id={contextIds.SESSION} let:target>
  {#if openSession}
    <MenuOption
      on:click={handleClickOpen}
      disabled={target?.id === currentSessionId}
      Icon={Window}
      text="Open"
    />
  {/if}
  {#if saveSession}
    <MenuOption on:click={handleClickSave} Icon={Save} text="Save" />
  {/if}
  {#if deleteSession}
    <MenuOption
      on:click={handleClickDelete}
      disabled={target?.id === currentSessionId}
      Icon={Bin}
      text="Delete"
    />
  {/if}
</ContextMenu>
