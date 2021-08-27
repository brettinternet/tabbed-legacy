<script lang="ts">
  import { onMount } from 'svelte'

  import './scrollbar.css'
  import { setupListeners } from 'src/components/app/listeners'
  import { isPopup } from 'src/components/app/store'
  import { modal, someModal, whichModal } from 'src/components/modal/store'
  import { settings } from 'src/components/settings/store'
  import { log } from 'src/utils/logger'
  import AppLayout from 'src/components/layout/layout.svelte'
  import Sessions from 'src/components/sessions/sessions.svelte'
  import SettingsModal from 'src/components/settings/settings.svelte'
  import ShortcutsModal from 'src/components/shortcuts/shortcuts.svelte'
  import ImportModal from 'src/components/import/import-modal.svelte'
  import Overlay from 'src/components/modal/overlay.svelte'
  import ContextMenu from 'src/components/context-menu/context-menu.svelte'
  import ToastProvider from 'src/components/toast/toasts.svelte'
  import FocusRingScope from 'src/components/focus/scope.svelte'
  import { activeRingContext } from 'src/components/focus/context'

  const logContext = 'components/app/app.svelte'

  onMount(setupListeners)

  const openSettings = () => {
    modal.settings.set(true)
  }

  const getActiveModal = (modal: string | undefined) => {
    switch (modal) {
      case 'settings':
        return SettingsModal
      case 'shortcuts':
        return ShortcutsModal
      case 'importer':
        return ImportModal
    }
  }

  $: log.debug(logContext, $settings, `modal: ${$someModal}`)
  $: console.log('activeRingContext', $activeRingContext)
</script>

{#if $settings}
  <FocusRingScope container={document.body}>
    <AppLayout
      onClickSettings={openSettings}
      currentLayout={$settings.layout}
      height={isPopup ? $settings.popupDimensions?.height : undefined}
    >
      <Sessions currentLayout={$settings.layout} />
    </AppLayout>
    <svelte:component this={getActiveModal($whichModal)} />
    {#if $someModal}
      <Overlay />
    {/if}
    <ContextMenu />
    <ToastProvider />
  </FocusRingScope>
{/if}
