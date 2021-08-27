<script lang="ts">
  import cn from 'classnames'

  import X from 'src/components/icons/x.svelte'
  import About from 'src/components/settings/about.svelte'
  import Options from 'src/components/settings/options/options.svelte'
  import Export from 'src/components/settings/export/export.svelte'
  import Import from 'src/components/settings/import.svelte'
  import Modal from 'src/components/modal/modal.svelte'
  import { modal } from 'src/components/modal/store'

  let shouldClose: (() => boolean) | undefined = undefined

  const handleClose = () => {
    if (!shouldClose || shouldClose()) {
      modal.off()
    }
  }

  const tabs = [
    { name: 'options', component: Options },
    { name: 'export', component: Export },
    { name: 'import', component: Import },
    { name: 'about', component: About },
  ]

  const selectTab = (i: number) => {
    if (!shouldClose || shouldClose()) {
      selectedTab = tabs[i]
    }
  }

  let selectedTab = tabs[0]
  const headerId = 'settings-h1'
</script>

<Modal
  close={handleClose}
  ariaLabelledby={headerId}
  stretchHeight
  classNames="lg:max-w-screen-sm"
>
  <header
    class="flex flex-row justify-between items-start p-3 xs:p-5 border-b border-gray-200"
  >
    <nav>
      {#each tabs as { name }, i (name)}
        <button
          on:click={() => {
            selectTab(i)
          }}
          class={cn(
            'mr-3 capitalize p-2 rounded-sm border-b-2 mb-2 xxs:mb-0',
            selectedTab.name === name && 'border-blue-700 dark:border-blue-400'
          )}>{name}</button
        >
      {/each}
    </nav>
    <button
      on:click={handleClose}
      class="py-2 px-3 rounded-sm"
      title={`Close ${selectedTab.name}`}
      aria-label={`Close ${selectedTab.name}`}
    >
      <X />
    </button>
  </header>
  <div class="overflow-y-auto scroll flex-1 p-3 xs:px-7 xs:py-5">
    <svelte:component
      this={selectedTab.component}
      {headerId}
      bind:shouldClose
    />
  </div>
</Modal>
