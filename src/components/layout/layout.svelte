<script lang="ts">
  import Header from 'src/components/header/header.svelte'
  import { appName } from 'src/utils/env'
  import type { Layout } from 'src/utils/settings'

  export let onClickPopout: () => void = null,
    onClickHome: () => void = null,
    pageTitle: string = null,
    currentLayout: Layout = null,
    onClickListLayout: () => void = null,
    onClickGridLayout: () => void = null,
    onClickSettings: () => void = null
</script>

<svelte:head>
  <title>{pageTitle ? `${pageTitle} - ${appName}` : appName}</title>
</svelte:head>

<Header
  {onClickPopout}
  {onClickHome}
  {currentLayout}
  {onClickListLayout}
  {onClickGridLayout}
  {onClickSettings}
/>
<main id="main" class="dark:bg-gray-900 dark:text-white">
  <slot />
</main>
