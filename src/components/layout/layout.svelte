<script lang="ts">
  import { _ } from 'svelte-i18n'
  import cn, { Argument as ClassnamesArgument } from 'classnames'
  import Header from 'src/components/header/header.svelte'
  import { appName } from 'src/utils/env'

  export let height: number = null,
    width: number = null,
    hidePopout: boolean = false,
    hideHome: boolean = false,
    pageTitle: string = null,
    mainClassnames: ClassnamesArgument = null

  const openPopout = async () => {
    await chrome.windows.create({
      type: 'popup',
      focused: true,
      url: 'popup/index.html',
      height,
      width,
    })
  }

  const openTab = async () => {
    await chrome.tabs.create({ url: 'main/index.html' })
  }
</script>

<svelte:head>
  <title>{pageTitle ? `${pageTitle} - ${appName}` : appName}</title>
</svelte:head>

<svelte:body style="background:pink" />

<Header
  onClickPopout={openPopout}
  onClickHome={openTab}
  {hidePopout}
  {hideHome}
/>
<main class={cn(mainClassnames)}>
  <slot />
</main>
