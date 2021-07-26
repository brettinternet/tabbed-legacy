<script lang="ts">
  import Cog from 'src/components/icons/cog.svelte'
  import MenuOption from './option.svelte'
  import { modal } from 'src/components/modal/store'

  const handleClickShortcuts = () => {
    modal.shortcuts.set(true)
  }

  const handleClickSettings = () => {
    modal.settings.set(true)
  }
</script>

<MenuOption on:click={handleClickShortcuts} Icon={null} text="Shortcuts" />
<MenuOption on:click={handleClickSettings} Icon={Cog} text="Settings" />
