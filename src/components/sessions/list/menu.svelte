<script lang="ts">
  import FocusScope from 'src/components/focus/scope.svelte'

  let menu: HTMLMenuElement | undefined
</script>

<menu
  bind:this={menu}
  id="menu"
  class="scroll relative p-0 m-0 lg:col-span-4 xl:col-span-3 z-menu-accordion lg:h-main lg:overflow-y-auto"
>
  <FocusScope container={menu}>
    <slot />
  </FocusScope>
</menu>
