import { tick } from 'svelte'
import { writable, get } from 'svelte/store'
import hotkeys from 'hotkeys-js'
import { noop } from 'lodash'

import { Settings, themes } from 'src/utils/settings'
import {isDefined} from 'src/utils/helpers'
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
const setupShortcuts = (enabled: boolean) => {
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
        case '/': {
          showShortcuts.set(false)
          showSettings.set(false)
          const search = document.getElementById('search')
          void tick()
            .then(() => {
              search?.focus()
            })
          break
        }
        case '`':
          showSettings.update(value => !value)
          showShortcuts.set(false)
          break
      }
    }
  })

  hotkeys('', shortcutScopes.DISABLED, noop)

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

/**
 * Invokes side effects for settings startup and changes
 */
const handleSettingsSideEffects = async <K extends keyof Settings>(
  key: K,
  settings: Partial<Settings>,
  updateBackgroundTasks?: boolean,
) => {
    switch (key) {
      case 'fontSize': {
        const { fontSize } = settings
        if (isDefined(fontSize)) {
          document.documentElement.style.fontSize = `${fontSize.toString()}px`
        }
        break
      }
      case 'shortcuts': {
        const { shortcuts } = settings
        if (isDefined(shortcuts)) {
          setupShortcuts(shortcuts) // TODO: fix this fn's types
        }
        break
      }
      case 'showTabCountBadge': {
        const { showTabCountBadge } = settings
        if (updateBackgroundTasks && isDefined(showTabCountBadge)) {
          const message: ReloadTabListeners = {
            type: MESSAGE_TYPE_RELOAD_TAB_LISTENERS,
            value: showTabCountBadge
          }
          await browser.runtime.sendMessage(message)
        }
        break
      }
      case 'extensionClickAction': {
        const { extensionClickAction } = settings
        if (updateBackgroundTasks && isDefined(extensionClickAction)) {
          const message: ReloadActionsMessage = { type: MESSAGE_TYPE_RELOAD_ACTIONS, value: extensionClickAction }
          await browser.runtime.sendMessage(message)
        }
        break
      }
      case 'popupDimensions': {
        const width = settings.popupDimensions?.width // TODO: fix typing
        const height = settings.popupDimensions?.height
        if (isPopup && width && height) {
          document.body.style.width = `${width}px`
          document.body.style.height = `${height}px`
        }
        break
      }
      case 'theme': {
        const { theme } = settings
        if (isDefined(theme)) {
          setTheme(theme)
        }
        break
      }
      case 'debugMode': {
        const { debugMode } = settings
        updateLogLevel(debugMode)
        if (updateBackgroundTasks && isDefined(debugMode)) {
          const message: UpdateLogLevel = { type: MESSAGE_TYPE_UPDATE_LOG_LEVEL, value: debugMode }
          await browser.runtime.sendMessage(message)
        }
        break
      }
      default:
        return
    }
}

/**
 * @source typed version of Object.keys
 * https://stackoverflow.com/a/59459000
 */
const getKeys = Object.keys as <T extends Record<string, unknown>>(obj: T) => Array<keyof T>

const getInitialSettings = async () => {
  const settings = await readSettings()

  const keys = getKeys(settings)
  await Promise.all(keys.map(async key => handleSettingsSideEffects(key, settings, false)))
  return settings
}

export const settings = writable<Settings>(undefined, set => {
  const read = async () => {
    set(await getInitialSettings())
  }

  void read()
})

export const updateSettings = async (values: Partial<Settings>) => {
  await writeSetting(values)
  settings.update(current => {
    return ({ ...current, ...values })
  })
  const keys = getKeys(values)
  await Promise.all(keys.map(async key => handleSettingsSideEffects(key, values, false)))
}
