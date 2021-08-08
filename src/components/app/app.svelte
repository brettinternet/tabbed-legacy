<script lang="ts">
  import { onMount } from 'svelte'

  import './scrollbar.css'
  import { setupListeners } from 'src/components/app/listeners'
  import { isPopup } from 'src/components/app/store'
  import { modal, someModal, whichModal } from 'src/components/modal/store'
  import { settings } from 'src/components/settings/store'
  import { log } from 'src/utils/logger'
  import AppLayout from 'src/components/layout/layout.svelte'
  import PageLoader from 'src/components/loader/page-loader.svelte'
  import Sessions from 'src/components/sessions/sessions.svelte'
  import SettingsModal from 'src/components/settings/settings.svelte'
  import ShortcutsModal from 'src/components/shortcuts/shortcuts.svelte'
  import ImportModal from 'src/components/import/import.svelte'
  import Overlay from 'src/components/modal/overlay.svelte'
  import ContextMenu from 'src/components/context-menu/context-menu.svelte'
  import ToastProvider from 'src/components/toast/toasts.svelte'

  const logContext = 'components/app/app.svelte'

  onMount(setupListeners)

  const openSettings = () => {
    modal.settings.set(true)
  }

  const getActiveModal = () => {
    switch ($whichModal) {
      case 'settings':
        return SettingsModal
      case 'shortcuts':
        return ShortcutsModal
      case 'importer':
        return ImportModal
    }
  }

  $: log.debug(logContext, $settings, 'some', $someModal)
</script>

{#if $settings}
  <AppLayout
    onClickSettings={openSettings}
    currentLayout={$settings.layout}
    height={isPopup ? $settings.popupDimensions?.height : undefined}
  >
    <Sessions currentLayout={$settings.layout} />
  </AppLayout>
  <svelte:component this={getActiveModal()} />
  {#if $someModal}
    <Overlay />
  {/if}
  <ContextMenu />
  <ToastProvider />
{:else}
  <PageLoader />
{/if}
