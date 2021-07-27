<script lang="ts">
  import cn from 'classnames'

  import X from 'src/components/icons/x.svelte'
  import About from 'src/components/settings/about.svelte'
  import Options from 'src/components/settings/options.svelte'
  import Modal from 'src/components/modal/modal.svelte'

  export let close: () => void

  const tabs = [
    { name: 'options', component: Options },
    { name: 'about', component: About },
  ]

  let selectedTab = tabs[0]
  const headerId = 'settings-h1'
  const headerHeight = 76
</script>

<Modal {close} ariaLabelledby={headerId} stretch>
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
      on:click={close}
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
