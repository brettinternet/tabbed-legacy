<script lang="ts">
  import { _, isLoading } from 'svelte-i18n'
  import './app'
  import Layout from 'src/components/layout/layout.svelte'
  import PageLoader from 'src/components/loader/page-loader.svelte'
  import Content from 'src/components/content/content.svelte'
  import { url } from 'src/utils/url-store'
  import { layouts } from 'src/utils/settings'

  export let width: number = null,
    height: number = null,
    hideNav = false

  const style =
    width && height ? `height:${height}px;width:${width}px` : undefined

  const openPopout = async () => {
    await window.chrome.windows.create({
      type: 'popup',
      focused: true,
      url: 'popup/index.html?uimode=popout',
      height,
      width,
    })
  }

  const openTab = async () => {
    await window.chrome.tabs.create({ url: 'main/index.html?uimode=settings' })
  }

  const openSettings = () => {
    console.log('open settings...')
  }

  $: isPopout =
    window.location.search.includes('popout') ||
    $url.searchParams.get('uimode') === 'popout'
  $: isTab =
    window.location.href.includes('main/index.html') ||
    $url.href.includes('main/index.html')

  let currentLayout = layouts.LIST
  const handleListLayout = () => {
    currentLayout = layouts.LIST
  }
  const handleGridLayout = () => {
    currentLayout = layouts.GRID
  }
</script>

{#if $isLoading}
  <PageLoader {style} hideLabel />
{:else if isPopout || isTab}
  <Layout
    pageTitle={$_('popup.page_title', { default: 'Options' })}
    onClickSettings={openSettings}
    {currentLayout}
    onClickListLayout={handleListLayout}
    onClickGridLayout={handleGridLayout}
  >
    <Content {currentLayout} />
  </Layout>
{:else}
  <div {style} class="mx-auto">
    <Layout
      pageTitle={$_('popup.page_title', { default: 'Options' })}
      onClickHome={openTab}
      onClickPopout={!hideNav && openPopout}
      {currentLayout}
      onClickListLayout={handleListLayout}
      onClickGridLayout={handleGridLayout}
    >
      <Content {currentLayout} />
    </Layout>
  </div>
{/if}
