<script lang="ts">
  import { _ } from 'svelte-i18n'
  import Cog from '../../components/icons/cog.svelte'
  import Expand from 'src/components/icons/expand.svelte'
  import Home from 'src/components/icons/home.svelte'
  import ListLayout from 'src/components/icons/list-layout.svelte'
  import GridLayout from 'src/components/icons/grid-layout.svelte'

  export let hidePopout: boolean = false,
    hideHome: boolean = false,
    onClickPopout: () => void,
    onClickHome: () => void,
    onClickListLayout: () => void,
    onClickGridLayout: () => void,
    onClickSettings: () => void
</script>

<header
  class="container mx-auto justify-around items-center bg-blueGray-500 px-2 py-3 mb-3"
>
  <ul class="w-full p-0 m-0 flex justify-center items-stretch text-gray-800">
    {#if !hidePopout}
      <li>
        <button
          class="px-4 py-1 h-full"
          on:click={onClickPopout}
          aria-label="Pop out to a new window"
          title="Pop out to a new window"><Expand /></button
        >
      </li>
    {/if}
    {#if !hideHome}
      <li>
        <button
          class="px-4 py-1 h-full"
          on:click={onClickHome}
          aria-label="Open in a new tab"
          title="Open in a new tab"><Home /></button
        >
      </li>
    {/if}
    <li class="mx-auto px-4 w-full">
      <input
        class="border rounded-sm border-gray-800 w-full px-2 py-1"
        placeholder="Search"
      />
    </li>
    <li>
      <button
        class="px-4 py-1 h-full"
        on:click={onClickListLayout}
        aria-label="Show list layout"
        title="Show list layout"><ListLayout /></button
      >
    </li>
    <li>
      <button
        class="px-4 py-1 h-full"
        on:click={onClickGridLayout}
        aria-label="Show grid layout"
        title="Show grid layout"><GridLayout /></button
      >
    </li>
    <li class="hidden lg:block">
      <button
        class="px-4 py-1 h-full"
        on:click={onClickSettings}
        aria-label="Settings"
        title="Settings"><Cog /></button
      >
    </li>
  </ul>
</header>
