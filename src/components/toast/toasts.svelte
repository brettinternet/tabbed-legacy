<script lang="ts">
  import { fly, scale } from 'svelte/transition'
  import { flip } from 'svelte/animate'
  import { toast } from 'src/components/toast/store'
  import Item from './item.svelte'
</script>

{#if $toast.length > 0}
  <ul
    class="fixed left-1/2 bottom-3 transform -translate-x-1/2 m-0 p-0 list-none z-toast"
  >
    {#each $toast as item (item.id)}
      <li
        in:fly={{ y: 200, opacity: 0.5 }}
        out:scale={{ duration: 150, opacity: 0 }}
        animate:flip={{ duration: 200 }}
      >
        <Item {item} />
      </li>
    {/each}
  </ul>
{/if}
