<script lang="ts">
  /**
   * @accessibility https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Search_role
   */
  import cn from 'classnames'

  import type { Layout } from 'src/utils/settings'
  import Cog from 'src/components/icons/cog.svelte'
  import { layouts } from 'src/utils/settings'
  import { getMessage } from 'src/utils/i18n'
  import Button from 'src/components/button/button.svelte'
  import Search from '../search/search.svelte'
  import { focusScope } from 'src/components/focus/scope'

  export let onClickSettings: OptionalProp<() => void> = undefined,
    currentLayout: OptionalProp<Layout> = undefined
</script>

<header
  use:focusScope
  class="h-header flex justify-around items-center sticky top-0 bg-white border-b border-gray-300 z-header lg:static lg:border-none text-gray-800 dark:bg-gray-900 dark:text-white dark:border-gray-500 mx-auto max-w-screen-2xl"
>
  <ul
    class={cn(
      'w-full m-0 flex px-4',
      currentLayout === layouts.LIST && 'lg:grid lg:grid-cols-12'
    )}
  >
    <li
      class={cn(
        'w-full mr-3',
        currentLayout === layouts.LIST
          ? 'lg:mr-0 lg:col-span-4 xl:col-span-3'
          : 'md:ml-auto md:mr-0 md:max-w-xs'
      )}
    >
      <Search />
    </li>
    {#if onClickSettings}
      <li
        class={cn(
          'lg:ml-auto',
          currentLayout === layouts.LIST && 'lg:col-start-12'
        )}
      >
        <Button
          class="px-4 py-1 h-full rounded-sm"
          onClick={onClickSettings}
          aria-label={getMessage('open_settings', 'open settings')}
          title={getMessage('open_settings', 'open settings')}><Cog /></Button
        >
      </li>
    {/if}
  </ul>
</header>
