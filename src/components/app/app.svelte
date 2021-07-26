<script lang="ts">
  import { _, isLoading } from 'svelte-i18n'

  import './scrollbar.css'
  import { isPopup } from 'src/components/app/store'
  import { modal, someModal } from 'src/components/modal/store'
  import { settings } from 'src/components/settings/store'
  import { log } from 'src/utils/logger'
  import AppLayout from 'src/components/layout/layout.svelte'
  import PageLoader from 'src/components/loader/page-loader.svelte'
  import Sessions from 'src/components/sessions/sessions.svelte'
  import SettingsModal from 'src/components/settings/settings.svelte'
  import ShortcutsModal from 'src/components/shortcuts/shortcuts.svelte'
  import Overlay from 'src/components/modal/overlay.svelte'
  import ContextMenu from 'src/components/context-menu/context-menu.svelte'

  const logContext = 'components/app/app.svelte'

  const openSettings = () => {
    modal.settings.set(true)
  }

  const onSubmitSearch: svelte.JSX.FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault()
    const search: HTMLInputElement | null =
      ev.currentTarget.querySelector('#search')
    console.log(search?.value)
  }

  $: log.debug(logContext, $settings, 'some', $someModal)
</script>

{#if $isLoading}
  <PageLoader hideLabel />
{:else if $settings}
  <AppLayout
    pageTitle={$_('popup.page_title', { default: 'Options' })}
    onClickSettings={openSettings}
    currentLayout={$settings.layout}
    {onSubmitSearch}
    height={isPopup ? $settings.popupDimensions?.height : undefined}
  >
    <Sessions currentLayout={$settings.layout} />
  </AppLayout>
  {#if $modal.settings}
    <SettingsModal close={modal.off} />
  {/if}
  {#if $modal.shortcuts}
    <ShortcutsModal close={modal.off} />
  {/if}
  {#if $someModal}
    <Overlay />
  {/if}
  <ContextMenu />
{/if}
