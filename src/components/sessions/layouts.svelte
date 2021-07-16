<script lang="ts">
  /**
   * @notes Layouts should comply with accessibility standards
   * https://www.w3.org/TR/2017/WD-wai-aria-practices-1.1-20170628/examples/grid/LayoutGrids.html
   */
  import { layouts } from 'src/utils/settings'
  import type {Layout} from 'src/utils/settings'
  import List from './list.svelte'
  import Grid from './grid.svelte'

  export let currentLayout: Layout,
    selectedSessionId: string = null
</script>

{#if currentLayout === layouts.GRID}
  <Grid {selectedSessionId} />
{:else}
  <List {selectedSessionId} />
{/if}
