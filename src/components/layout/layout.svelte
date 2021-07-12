<script lang="ts">
  import cn, { Argument as ClassnamesArgument } from 'classnames'
  import Header from 'src/components/header/header.svelte'
  import { appName } from 'src/utils/env'

  export let onClickPopout: () => void = null,
    onClickHome: () => void = null,
    pageTitle: string = null,
    mainClassnames: ClassnamesArgument = null
</script>

<svelte:head>
  <title>{pageTitle ? `${pageTitle} - ${appName}` : appName}</title>
</svelte:head>

<Header {onClickPopout} {onClickHome} />
<main class={cn(mainClassnames)}>
  <slot />
</main>
