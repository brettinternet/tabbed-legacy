<script lang="ts">
  import { _, isLoading } from 'svelte-i18n'
  import Layout from 'src/components/layout/layout.svelte'
  import PageLoader from 'src/components/loader/page-loader.svelte'
  import ListContent from 'src/components/content/list-content.svelte'

  let height = 500,
    width = 500

  const style = `height:${height}px;width:${width}px`
</script>

{#if $isLoading}
  <PageLoader {style} />
{:else}
  <div {style}>
    <Layout
      pageTitle={$_('popup.page_title', { default: 'Options' })}
      {height}
      {width}
    >
      <ListContent />
    </Layout>
  </div>
{/if}
