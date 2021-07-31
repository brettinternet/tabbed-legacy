import { get } from 'svelte/store'

import type { EventHandler } from 'src/utils/svelte'
import { extensionClickActions, defaultSettings } from 'src/utils/settings'
import { updateSettings, settings } from 'src/components/settings/store'
import { modal } from 'src/components/modal/store'
import { purgeAllStorage } from 'src/utils/browser/storage'
import { browserRuntime, browsers } from 'src/utils/env'

export const handleChangeLayout: EventHandler<Event, HTMLInputElement> = async (
  ev
) => {
  await updateSettings({ layout: ev.currentTarget.value })
}

export const handleChangeToggleExtensionClickAction: EventHandler<
  Event,
  HTMLInputElement
> = async (ev) => {
  const checked = ev.currentTarget.checked
  await updateSettings({
    extensionClickAction: extensionClickActions[checked ? 'TAB' : 'POPUP'],
  })
}

export const handleChangeRadioExtensionClickAction: EventHandler<
  Event,
  HTMLInputElement
> = async (ev) => {
  await updateSettings({
    extensionClickAction: ev.currentTarget.value,
  })
}

export const handleChangeSaveClosedWindow: EventHandler<
  Event,
  HTMLInputElement
> = async (ev) => {
  await updateSettings({
    saveClosedWindows: ev.currentTarget.checked,
  })
}

export const handleChangeSaveIncognito: EventHandler<Event, HTMLInputElement> =
  async (ev) => {
    await updateSettings({
      saveIncognito: ev.currentTarget.checked,
    })
  }

export const handleChangeTabCountBadge: EventHandler<Event, HTMLInputElement> =
  async (ev) => {
    await updateSettings({
      showTabCountBadge: ev.currentTarget.checked,
    })
  }

export const handleChangeShortcuts: EventHandler<Event, HTMLInputElement> =
  async (ev) => {
    await updateSettings({
      shortcuts: ev.currentTarget.checked,
    })
  }

export const handleChangeFontSize: EventHandler<Event, HTMLInputElement> =
  async (ev) => {
    await updateSettings({
      fontSize: parseInt(ev.currentTarget.value),
    })
  }

export const handleChangePopupDimension: EventHandler<Event, HTMLInputElement> =
  async (ev) => {
    await updateSettings({
      popupDimensions: {
        ...get(settings).popupDimensions,
        [ev.currentTarget.name]: parseInt(ev.currentTarget.value),
      },
    })
  }

export const handleChangeTheme: EventHandler<Event, HTMLInputElement> = async (
  ev
) => {
  await updateSettings({
    theme: ev.currentTarget.value,
  })
}

export const handleChangeDebugMode: EventHandler<Event, HTMLInputElement> =
  async (ev) => {
    await updateSettings({
      debugMode: ev.currentTarget.checked,
    })
  }

export const handleClickReset: EventHandler<MouseEvent, HTMLButtonElement> =
  async () => {
    await updateSettings(defaultSettings)
  }

export const handlePurgeAllStorage: EventHandler<
  MouseEvent,
  HTMLButtonElement
> = async () => {
  await purgeAllStorage()
  window.location.reload()
}

export const handleChangeSortFocusedWindowFirst: EventHandler<
  Event,
  HTMLInputElement
> = async (ev) => {
  await updateSettings({
    sortFocusedWindowFirst: ev.currentTarget.checked,
  })
}

export const handleOpenShortcuts: EventHandler<MouseEvent, HTMLButtonElement> =
  () => {
    modal.shortcuts.set(true)
  }

export const handleOpenOptions: EventHandler<MouseEvent, HTMLButtonElement> =
  async () => {
    if (browserRuntime === browsers.CHROMIUM) {
      await browser.tabs.create({
        url: `chrome://extensions/?id=${browser.runtime.id}`,
      })
    }
  }
