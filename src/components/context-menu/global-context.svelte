<script lang="ts">
  import ContextMenu from './context-menu.svelte'
  import { contextIds } from 'src/components/context-menu/store'
</script>

<ContextMenu id={contextIds.GLOBAL} />
