<script lang="ts">
  import { layouts } from 'src/utils/settings'
  import List from './list-content.svelte'
  import Grid from './grid-content.svelte'
  import type {Layout} from 'src/utils/settings'

  export let currentLayout: Layout
</script>

{#if currentLayout === layouts.GRID}
  <Grid />
{:else}
  <List />
{/if}
