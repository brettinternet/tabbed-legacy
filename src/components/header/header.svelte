<script lang="ts">
  import { _ } from 'svelte-i18n'
  import cn from 'classnames'
  import Cog from 'src/components/icons/cog.svelte'
  import Popout from 'src/components/icons/send-up.svelte'
  import TabView from 'src/components/icons/window.svelte'
  import ListLayout from 'src/components/icons/list-layout.svelte'
  import GridLayout from 'src/components/icons/grid-layout.svelte'
  import { layouts } from 'src/utils/settings'
  import type { Layout } from 'src/utils/settings'

  export let onClickPopout: () => void = null,
    onClickHome: () => void = null,
    currentLayout: Layout = null,
    onClickListLayout: () => void = null,
    onClickGridLayout: () => void = null,
    onClickSettings: () => void = null
</script>

<header class="mx-auto justify-around items-center bg-blueGray-500 px-2 py-3">
  <ul class="w-full p-0 m-0 flex justify-center items-stretch text-gray-800">
    {#if onClickPopout}
      <li>
        <button
          class="px-4 py-1 h-full"
          on:click={onClickPopout}
          aria-label="Pop out to a new window"
          title="Pop out to a new window"><Popout /></button
        >
      </li>
    {/if}
    {#if onClickHome}
      <li>
        <button
          class="px-4 py-1 h-full"
          on:click={onClickHome}
          aria-label="Open in a new tab"
          title="Open in a new tab"><TabView /></button
        >
      </li>
    {/if}
    {#if onClickSettings}
      <li class="lg:hidden">
        <button
          class="px-4 py-1 h-full"
          on:click={onClickSettings}
          aria-label="Settings"
          title="Settings"><Cog /></button
        >
      </li>
    {/if}
    <li class="mx-auto px-4 lg:px-0 w-full lg:ml-0 lg:mr-auto">
      <input
        class="border rounded-sm border-gray-800 w-full px-2 py-1 lg:max-w-xs"
        placeholder={$_('common.search_placeholder', { default: 'Search' })}
      />
    </li>
    {#if onClickGridLayout}
      <li>
        <button
          class={cn(
            'px-4 py-1 h-full',
            currentLayout === layouts.GRID && 'bg-gray-200'
          )}
          on:click={onClickGridLayout}
          aria-label="Show grid layout"
          title="Show grid layout"><GridLayout /></button
        >
      </li>
    {/if}
    {#if onClickListLayout}
      <li>
        <button
          class={cn(
            'px-4 py-1 h-full',
            currentLayout === layouts.LIST && 'bg-gray-200'
          )}
          on:click={onClickListLayout}
          aria-label="Show list layout"
          title="Show list layout"><ListLayout /></button
        >
      </li>
    {/if}
    {#if onClickSettings}
      <li class="hidden lg:block">
        <button
          class="px-4 py-1 h-full"
          on:click={onClickSettings}
          aria-label="Settings"
          title="Settings"><Cog /></button
        >
      </li>
    {/if}
  </ul>
</header>
