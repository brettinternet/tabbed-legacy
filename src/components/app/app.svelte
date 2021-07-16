<script lang="ts">
  import { _, isLoading } from 'svelte-i18n'

  import './scrollbar.css'
  import {
    isPopout,
    isTab,
    showSettings,
    showShortcuts,
  } from 'src/components/app/store'
  import { settings, updateSettings } from 'src/components/settings/store'
  import {
    openExtensionTab,
    openExtensionPopout,
  } from 'src/utils/browser/actions'
  import AppLayout from 'src/components/layout/layout.svelte'
  import PageLoader from 'src/components/loader/page-loader.svelte'
  import Content from 'src/components/content/content.svelte'
  import SettingsModal from 'src/components/settings/settings.svelte'
  import ShortcutsModal from 'src/components/shortcuts/shortcuts.svelte'
  import { layouts } from 'src/utils/settings'

  const openPopout = async () => {
    await openExtensionPopout()
  }
  const openTab = async () => {
    await openExtensionTab()
  }

  const openSettings = () => {
    showSettings.set(true)
  }
  const closeSettings = () => {
    showSettings.set(false)
  }
  const closeShortcuts = () => {
    showShortcuts.set(false)
  }

  const handleListLayout = () => {
    updateSettings({ layout: layouts.LIST })
  }
  const handleGridLayout = () => {
    updateSettings({ layout: layouts.GRID })
  }

  $: console.log('settings', $settings)
</script>

{#if $isLoading}
  <PageLoader hideLabel />
{:else if $settings}
  <AppLayout
    pageTitle={$_('popup.page_title', { default: 'Options' })}
    onClickSettings={openSettings}
    onClickHome={isPopout && !isTab && openTab}
    onClickPopout={!isPopout && !isTab && openPopout}
    currentLayout={$settings.layout}
    onClickListLayout={handleListLayout}
    onClickGridLayout={handleGridLayout}
  >
    <Content currentLayout={$settings.layout} />
  </AppLayout>
  {#if $showSettings}
    <SettingsModal close={closeSettings} />
  {/if}
  {#if $showShortcuts}
    <ShortcutsModal close={closeShortcuts} />
  {/if}
  <!-- <div
    style={`width:${$settings.popupDimensions.width}px;height:${$settings.popupDimensions.height}px`}
  >
  </div> -->
{/if}
