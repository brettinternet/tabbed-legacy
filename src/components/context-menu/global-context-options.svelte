<script lang="ts">
  import Cog from 'src/components/icons/cog.svelte'
  import MenuOption from './option.svelte'
  import { showSettings, showShortcuts } from 'src/components/app/store'

  const handleClickShortcuts = () => {
    $showShortcuts = true
  }

  const handleClickSettings = () => {
    $showSettings = true
  }
</script>

<MenuOption on:click={handleClickShortcuts} Icon={null} text="Shortcuts" />
<MenuOption on:click={handleClickSettings} Icon={Cog} text="Settings" />
