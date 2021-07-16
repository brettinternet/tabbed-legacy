<script lang="ts">
  import Header from 'src/components/header/header.svelte'
  import { appName } from 'src/utils/env'
  import type { Layout } from 'src/utils/settings'

  export let pageTitle: string = null,
    currentLayout: Layout = null,
    onClickSettings: () => void = null,
    onChangeSearch: svelte.JSX.ChangeEventHandler<HTMLInputElement>
</script>

<svelte:head>
  <title>{pageTitle ? `${pageTitle} - ${appName}` : appName}</title>
</svelte:head>

<Header {currentLayout} {onClickSettings} {onChangeSearch} />
<main id="main" class="dark:bg-gray-900 dark:text-white">
  <slot />
</main>
