<script lang="ts">
  import { _, isLoading } from 'svelte-i18n'

  import './scrollbar.css'
  import {
    showSettings,
    showShortcuts,
    isPopup,
  } from 'src/components/app/store'
  import { settings } from 'src/components/settings/store'
  import AppLayout from 'src/components/layout/layout.svelte'
  import PageLoader from 'src/components/loader/page-loader.svelte'
  import SessionLayouts from 'src/components/sessions/layouts.svelte'
  import SettingsModal from 'src/components/settings/settings.svelte'
  import ShortcutsModal from 'src/components/shortcuts/shortcuts.svelte'

  const openSettings = () => {
    showSettings.set(true)
  }
  const closeSettings = () => {
    showSettings.set(false)
  }
  const closeShortcuts = () => {
    showShortcuts.set(false)
  }

  const handleChangeSearch: svelte.JSX.ChangeEventHandler<HTMLInputElement> = ev => {
    console.log(ev.currentTarget.value)
  }

  $: console.log('settings', $settings)
</script>

{#if $isLoading}
  <PageLoader hideLabel />
{:else if $settings}
  <AppLayout
    pageTitle={$_('popup.page_title', { default: 'Options' })}
    onClickSettings={openSettings}
    currentLayout={$settings.layout}
    onChangeSearch={handleChangeSearch}
    height={isPopup && $settings.popupDimensions?.height}
  >
    <SessionLayouts currentLayout={$settings.layout} />
  </AppLayout>
  {#if $showSettings}
    <SettingsModal close={closeSettings} />
  {/if}
  {#if $showShortcuts}
    <ShortcutsModal close={closeShortcuts} />
  {/if}
{/if}
