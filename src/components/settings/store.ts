import { writable } from 'svelte/store'

import { Settings, themes } from 'src/utils/settings'
import { isDefined } from 'src/utils/helpers'
import type { Theme } from 'src/utils/settings'
import { readSettings, writeSetting } from 'src/utils/browser/storage'
import { isPopup } from 'src/components/app/store'
import { updateLogLevel, log } from 'src/utils/logger'
import { sortCurrentSession } from 'src/components/sessions/store'
import {
  setupShortcuts,
  enableShortcuts,
  disableShortcuts,
} from 'src/components/settings/hotkeys'
import {
  reloadTabListeners,
  reloadExtensionActions,
  updateBackgroundLogLevel,
  reloadClosedWindowListeners,
} from 'src/components/settings/send'

const logContext = 'components/settings/store'

const setFontSize = (size: number) => {
  document.documentElement.style.fontSize = `${size}px`
}

const setTheme = (theme: Theme) => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (theme === themes.DARK || (theme === themes.SYSTEM && prefersDark)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const setBodySize = (width: number, height: number) => {
  document.body.style.width = `${width}px`
  document.body.style.height = `${height}px`
}

/**
 * Invokes side effects for settings startup and changes
 */
const handleSettingsSideEffects = async <K extends keyof Settings>(
  key: K,
  settings: Partial<Settings>,
  updateBackgroundTasks?: boolean
) => {
  switch (key) {
    case 'fontSize': {
      const { fontSize } = settings
      if (isDefined(fontSize)) {
        setFontSize(fontSize)
      }
      break
    }
    case 'shortcuts': {
      const { shortcuts } = settings
      if (isDefined(shortcuts)) {
        if (shortcuts) {
          enableShortcuts()
        } else {
          disableShortcuts()
        }
      }
      break
    }
    case 'showTabCountBadge': {
      const { showTabCountBadge } = settings
      if (updateBackgroundTasks && isDefined(showTabCountBadge)) {
        void reloadTabListeners(showTabCountBadge)
      }
      break
    }
    case 'extensionClickAction': {
      const { extensionClickAction } = settings
      if (updateBackgroundTasks && isDefined(extensionClickAction)) {
        void reloadExtensionActions(extensionClickAction)
      }
      break
    }
    case 'popupDimensions': {
      const width = settings.popupDimensions?.width
      const height = settings.popupDimensions?.height
      if (isPopup && width && height) {
        setBodySize(width, height)
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
        void updateBackgroundLogLevel(debugMode)
      }
      break
    }
    case 'saveClosedWindows': {
      const { saveClosedWindows } = settings
      if (updateBackgroundTasks && isDefined(saveClosedWindows)) {
        void reloadClosedWindowListeners(saveClosedWindows)
      }
      break
    }
    case 'sortFocusedWindowFirst':
      await sortCurrentSession()
      break
  }
}

/**
 * @source typed version of Object.keys
 * https://stackoverflow.com/a/59459000
 */
const getKeys = Object.keys as <T extends Record<string, unknown>>(
  obj: T
) => Array<keyof T>

const getInitialSettings = async () => {
  setupShortcuts()

  const settings = await readSettings()

  const keys = getKeys(settings)
  await Promise.all(
    keys.map(async (key) => handleSettingsSideEffects(key, settings, false))
  )
  return settings
}

export const settings = writable<Settings>(undefined, (set) => {
  const read = async () => {
    try {
      const settings = await getInitialSettings()
      set(settings)
    } catch (err) {
      log.error(logContext, err)
    }
  }

  void read()
})

export const updateSettings = async (values: Partial<Settings>) => {
  await writeSetting(values)
  settings.update((current) => {
    return { ...current, ...values }
  })
  const keys = getKeys(values)
  await Promise.all(
    keys.map(async (key) => handleSettingsSideEffects(key, values, true))
  )
}
