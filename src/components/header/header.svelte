<script lang="ts">
  /**
   * @accessibility https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Search_role
   */
  import { _ } from 'svelte-i18n'
  import cn from 'classnames'

  import Cog from 'src/components/icons/cog.svelte'
  import Input from 'src/components/input/input.svelte'
  import { layouts } from 'src/utils/settings'
  import type { Layout } from 'src/utils/settings'

  export let onClickSettings: OptionalProp<() => void> = undefined,
    currentLayout: OptionalProp<Layout> = undefined,
    onSubmitSearch: svelte.JSX.FormEventHandler<HTMLFormElement>
</script>

<header
  class="justify-around items-center p-4 sticky top-0 bg-white border-b border-gray-300 z-header lg:static lg:border-none text-gray-800 dark:bg-gray-900 dark:text-white dark:border-gray-500 mx-auto max-w-screen-2xl"
>
  <ul class="w-full p-0 m-0 flex justify-center items-stretch">
    <li
      class={cn(
        'w-full mr-3',
        currentLayout === layouts.LIST
          ? 'md:mr-auto md:max-w-xs'
          : 'md:ml-auto md:mr-0 md:max-w-xs'
      )}
    >
      <form
        role="search"
        on:submit={onSubmitSearch}
        aria-label="Windows and tabs"
      >
        <Input
          id="search"
          classNames="w-full"
          type="text"
          placeholder={$_('common.search_placeholder', { default: 'Search' })}
        />
      </form>
    </li>
    {#if onClickSettings}
      <li>
        <button
          class="px-4 py-1 h-full rounded-sm"
          on:click={onClickSettings}
          aria-label={$_('common.settings.open_button', {
            default: 'Open settings',
          })}
          title={$_('common.settings.open_button', {
            default: 'Open settings',
          })}><Cog /></button
        >
      </li>
    {/if}
  </ul>
</header>
