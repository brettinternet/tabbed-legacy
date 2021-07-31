import { get } from 'svelte/store'
import { extensionClickActions, defaultSettings } from 'src/utils/settings'
import { updateSettings, settings } from 'src/components/settings/store'
import { modal } from 'src/components/modal/store'
import { purgeAllStorage } from 'src/utils/browser/storage'
import { browserRuntime, browsers } from 'src/utils/env'

export const handleChangeLayout: svelte.JSX.FormEventHandler<HTMLInputElement> =
  async (ev) => {
    await updateSettings({ layout: ev.currentTarget.value })
  }

export const handleChangeToggleExtensionClickAction: svelte.JSX.FormEventHandler<HTMLInputElement> =
  async (ev) => {
    const checked = ev.currentTarget.checked
    await updateSettings({
      extensionClickAction: extensionClickActions[checked ? 'TAB' : 'POPUP'],
    })
  }

export const handleChangeRadioExtensionClickAction: svelte.JSX.FormEventHandler<HTMLInputElement> =
  async (ev) => {
    await updateSettings({
      extensionClickAction: ev.currentTarget.value,
    })
  }

export const handleChangeSaveClosedWindow: svelte.JSX.FormEventHandler<HTMLInputElement> =
  async (ev) => {
    await updateSettings({
      saveClosedWindows: ev.currentTarget.checked,
    })
  }

export const handleChangeSaveIncognito: svelte.JSX.FormEventHandler<HTMLInputElement> =
  async (ev) => {
    await updateSettings({
      saveIncognito: ev.currentTarget.checked,
    })
  }

export const handleChangeTabCountBadge: svelte.JSX.FormEventHandler<HTMLInputElement> =
  async (ev) => {
    await updateSettings({
      showTabCountBadge: ev.currentTarget.checked,
    })
  }

export const handleChangeShortcuts: svelte.JSX.FormEventHandler<HTMLInputElement> =
  async (ev) => {
    await updateSettings({
      shortcuts: ev.currentTarget.checked,
    })
  }

export const handleChangeFontSize: svelte.JSX.FormEventHandler<HTMLInputElement> =
  async (ev) => {
    await updateSettings({
      fontSize: parseInt(ev.currentTarget.value),
    })
  }

export const handleChangePopupDimension: svelte.JSX.FormEventHandler<HTMLInputElement> =
  async (ev) => {
    await updateSettings({
      popupDimensions: {
        ...get(settings).popupDimensions,
        [ev.currentTarget.name]: parseInt(ev.currentTarget.value),
      },
    })
  }

export const handleChangeTheme: svelte.JSX.FormEventHandler<HTMLInputElement> =
  async (ev) => {
    await updateSettings({
      theme: ev.currentTarget.value,
    })
  }

export const handleChangeDebugMode: svelte.JSX.FormEventHandler<HTMLInputElement> =
  async (ev) => {
    await updateSettings({
      debugMode: ev.currentTarget.checked,
    })
  }

export const handleClickReset: svelte.JSX.MouseEventHandler<HTMLButtonElement> =
  async () => {
    await updateSettings(defaultSettings)
  }

export const handlePurgeAllStorage: svelte.JSX.MouseEventHandler<HTMLButtonElement> =
  async () => {
    await purgeAllStorage()
    window.location.reload()
  }

export const handleChangeSortFocusedWindowFirst: svelte.JSX.FormEventHandler<HTMLInputElement> =
  async (ev) => {
    await updateSettings({
      sortFocusedWindowFirst: ev.currentTarget.checked,
    })
  }

export const handleOpenShortcuts: svelte.JSX.MouseEventHandler<HTMLButtonElement> =
  () => {
    modal.shortcuts.set(true)
  }

export const handleOpenOptions: svelte.JSX.MouseEventHandler<HTMLButtonElement> =
  async () => {
    if (browserRuntime === browsers.CHROMIUM) {
      await browser.tabs.create({
        url: `chrome://extensions/?id=${browser.runtime.id}`,
      })
    }
  }
