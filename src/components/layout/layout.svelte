<script lang="ts">
  import cn, { Argument as ClassnamesArgument } from 'classnames'
  import Header from 'src/components/header/header.svelte'
  import { appName } from 'src/utils/env'
  import type { Layout } from 'src/utils/settings'

  export let onClickPopout: () => void = null,
    onClickHome: () => void = null,
    pageTitle: string = null,
    mainClassnames: ClassnamesArgument = null,
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
<main class={cn(mainClassnames)}>
  <slot />
</main>
