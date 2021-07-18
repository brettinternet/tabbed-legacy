<script lang="ts">
  import Header from 'src/components/header/header.svelte'
  import { appName } from 'src/utils/env'
  import type { Layout } from 'src/utils/settings'

  export let onSubmitSearch: svelte.JSX.FormEventHandler<HTMLFormElement>,
    pageTitle: OptionalProp<string> = undefined,
    currentLayout: OptionalProp<Layout> = undefined,
    onClickSettings: OptionalProp<() => void> = undefined,
    height: OptionalProp<number> = undefined
</script>

<svelte:head>
  <title>{pageTitle ? `${pageTitle} - ${appName}` : appName}</title>
</svelte:head>

{#if height}
  <div id="popup" style={`height:${height}px;`} class="scroll overflow-y-auto">
    <Header {currentLayout} {onClickSettings} {onSubmitSearch} />
    <main id="main" class="dark:bg-gray-900 dark:text-white">
      <slot />
    </main>
  </div>
{:else}
  <Header {currentLayout} {onClickSettings} {onSubmitSearch} />
  <main id="main" class="dark:bg-gray-900 dark:text-white">
    <slot />
  </main>
{/if}
