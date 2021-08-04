<script lang="ts">
  import cn from 'classnames'

  import X from 'src/components/icons/x.svelte'
  import About from 'src/components/settings/about.svelte'
  import Options from 'src/components/settings/options/options.svelte'
  import Export from 'src/components/settings/export/export.svelte'
  import Modal from 'src/components/modal/modal.svelte'
  import { modal } from 'src/components/modal/store'

  const tabs = [
    { name: 'options', component: Options },
    { name: 'export', component: Export },
    { name: 'about', component: About },
  ]

  let selectedTab = tabs[0]
  const headerId = 'settings-h1'
  const headerHeight = 76
</script>

<Modal
  close={modal.off}
  ariaLabelledby={headerId}
  stretchHeight
  classNames="lg:max-w-screen-sm"
>
  <header
    class="flex flex-row justify-between p-5"
    style={`height:${headerHeight}px`}
  >
    <nav>
      {#each tabs as { name }, i (name)}
        <button
          on:click={() => {
            selectedTab = tabs[i]
          }}
          class={cn(
            'mr-3 capitalize p-2 rounded-sm border-b-2',
            selectedTab.name === name && 'border-blue-700 dark:border-blue-400'
          )}>{name}</button
        >
      {/each}
    </nav>
    <button
      on:click={modal.off}
      class="py-2 px-3 rounded-sm"
      title={`Close ${selectedTab.name}`}
      aria-label={`Close ${selectedTab.name}`}
    >
      <X />
    </button>
  </header>
  <div
    class="p-7 overflow-y-auto scroll"
    style={`height:calc(100% - ${headerHeight}px);`}
  >
    <svelte:component this={selectedTab.component} {headerId} />
  </div>
</Modal>
