import { tick } from 'svelte'
import { writable, get } from 'svelte/store'
import hotkeys from 'hotkeys-js'

import { defaultSettings, Settings, themes } from 'src/utils/settings'
import type { Theme } from 'src/utils/settings'
import type { ReloadActionsMessage, ReloadTabListeners, UpdateLogLevel } from 'src/utils/messages'
import {
  MESSAGE_TYPE_RELOAD_ACTIONS,
  MESSAGE_TYPE_RELOAD_TAB_LISTENERS,
  MESSAGE_TYPE_UPDATE_LOG_LEVEL
} from 'src/utils/messages'
import { readSettings, writeSetting } from 'src/utils/browser/storage'
import { isPopup, showSettings, showShortcuts } from 'src/components/app/store'
import { updateLogLevel } from 'src/utils/logger'

const shortcutScopes = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
}
const setupShortcuts = async (enabled: boolean) => {
  hotkeys('shift+/,esc,/,`', shortcutScopes.ENABLED, (event, handler) => {
    if (enabled) {
      event.preventDefault()
      switch (handler.key) {
        case 'shift+/': // `?` mark
          showShortcuts.update(value => !value)
          showSettings.set(false)
          break
        case 'esc':
          if (get(showShortcuts) || get(showSettings)) {
            showShortcuts.set(false)
            showSettings.set(false)
          } else if (isPopup) {
            window.close()
          }
          break
        case '/':
          showShortcuts.set(false)
          showSettings.set(false)
          const search = document.getElementById('search')
          new Promise(resolve => {
            tick()
              .then(() => {
                search.focus()
              })
              .then(resolve)
          })
          break
        case '`':
          showSettings.update(value => !value)
          showShortcuts.set(false)
          break
      }
    }
  })

  hotkeys('', shortcutScopes.DISABLED, () => {})

  // https://github.com/jaywcjlove/hotkeys/issues/90
  hotkeys.setScope(shortcutScopes[enabled ? 'ENABLED' : 'DISABLED'])
}

const setTheme = (theme: Theme) => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (theme === themes.DARK || (theme === themes.SYSTEM && prefersDark)) {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}

const handleSettingsSideEffects = async (
  key: string,
  value: unknown,
  updateBackgroundTasks?: boolean,
) => {
  switch (key as keyof Settings) {
    case 'fontSize':
      document.documentElement.style.fontSize = `${value.toString()}px`
      break
    case 'shortcuts':
      setupShortcuts(value as boolean) // TODO: fix this fn's types
      break
    case 'showTabCountBadge':
      if (updateBackgroundTasks) {
        const message: ReloadTabListeners = {
          type: MESSAGE_TYPE_RELOAD_TAB_LISTENERS,
          value: value as boolean
        }
        await browser.runtime.sendMessage(message)
        break
      }
    case 'extensionClickAction':
      if (updateBackgroundTasks) {
        const message: ReloadActionsMessage = { type: MESSAGE_TYPE_RELOAD_ACTIONS, value: value as Settings['extensionClickAction'] }
        await browser.runtime.sendMessage(message)
        break
      }
    case 'popupDimensions':
      const width = (value as Record<string, number>)?.width // TODO: fix typing
      const height = (value as Record<string, number>)?.height
      if (isPopup && width && height) {
        document.body.style.width = `${width}px`
        document.body.style.height = `${height}px`
      }
      break
    case 'theme':
      setTheme(value as Theme)
      break
    case 'debugMode':
      updateLogLevel(value as boolean)
      if (updateBackgroundTasks) {
        const message: UpdateLogLevel = { type: MESSAGE_TYPE_UPDATE_LOG_LEVEL, value: value as boolean }
        await browser.runtime.sendMessage(message)
      }
      break
  }
}

const getInitialSettings = async () => {
  const settings = await readSettings()
  for (let key in defaultSettings) {
    await handleSettingsSideEffects(key, settings[key], false)
  }
  return settings
}

export const settings = writable<Settings>(null, set => {
  const read = async () => {
    set(await getInitialSettings())
  }

  read()
})

export const updateSettings = async (values: Partial<Settings>) => {
  writeSetting(values)
  settings.update(current => {
    return ({ ...current, ...values })
  })
  for (let key in values) {
    handleSettingsSideEffects(key, values[key], true)
  }
}
