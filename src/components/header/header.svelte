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


  /**
   * Filter escape key to prevent closing popup, and blur the input instead
   */
  const handleSearchKeyDown: svelte.JSX.KeyboardEventHandler<HTMLInputElement> = (ev) => {
    if (ev.key === "Escape") {
      ev.preventDefault()
      ev.currentTarget.blur()
    }
  }
</script>

<header
  class="mx-auto justify-around items-center px-2 py-3 sticky top-0 bg-white border-b border-gray-300 z-header lg:static lg:border-none dark:bg-gray-900 dark:text-white dark:border-gray-500"
>
  <ul class="w-full p-0 m-0 flex justify-center items-stretch text-gray-800">
    {#if onClickPopout}
      <li class="hidden xs:list-item">
        <button
          class="px-4 py-1 h-full rounded-sm mr-1"
          on:click={onClickPopout}
          aria-label="Pop out to a new window"
          title="Pop out to a new window"><Popout /></button
        >
      </li>
    {/if}
    {#if onClickHome}
      <li class="hidden xs:block">
        <button
          class="px-4 py-1 h-full rounded-sm mr-1"
          on:click={onClickHome}
          aria-label="Open in a new tab"
          title="Open in a new tab"><TabView /></button
        >
      </li>
    {/if}
    {#if onClickSettings}
      <li class="hidden xxs:list-item lg:hidden">
        <button
          class="px-4 py-1 h-full rounded-sm mr-1"
          on:click={onClickSettings}
          aria-label="Open settings"
          title="Open settings"><Cog /></button
        >
      </li>
    {/if}
    <li class="mx-auto px-4 lg:px-0 w-full lg:ml-0 lg:mr-auto">
      <input
        id="search"
        class="border rounded-sm border-gray-800 w-full px-2 py-1 lg:max-w-xs dark:bg-gray-900 dark:border-gray-500 dark:text-white"
        placeholder={$_('common.search_placeholder', { default: 'Search' })}
        on:keydown={handleSearchKeyDown}
      />
    </li>
    {#if onClickGridLayout}
      <li class="hidden xs:block">
        <button
          class={cn(
            'px-4 py-1 h-full rounded-sm ml-1',
            currentLayout === layouts.GRID && 'bg-gray-200'
          )}
          on:click={onClickGridLayout}
          aria-label="Show grid layout"
          title="Show grid layout"><GridLayout /></button
        >
      </li>
    {/if}
    {#if onClickListLayout}
      <li class="hidden xs:block">
        <button
          class={cn(
            'px-4 py-1 h-full rounded-sm ml-1',
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
          class="px-4 py-1 h-full rounded-sm ml-1"
          on:click={onClickSettings}
          aria-label="Open settings"
          title="Open settings"><Cog /></button
        >
      </li>
    {/if}
  </ul>
</header>
