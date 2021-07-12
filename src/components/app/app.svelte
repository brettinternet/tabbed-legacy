<script lang="ts">
  import { _, isLoading } from 'svelte-i18n'
  import Layout from 'src/components/layout/layout.svelte'
  import PageLoader from 'src/components/loader/page-loader.svelte'
  import Content from 'src/components/content/content.svelte'
  import { url } from 'src/utils/url-store'
  import { layouts } from 'src/utils/settings'

  export let width: number,
    height: number,
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

  $: isPopout =
    window.location.search.includes('popout') ||
    $url.searchParams.get('uimode') === 'popout'

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
{:else if isPopout}
  <Layout
    pageTitle={$_('popup.page_title', { default: 'Options' })}
    onClickSettings={openTab}
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
