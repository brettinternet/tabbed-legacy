import type { SvelteComponent } from 'svelte'
import { writable } from 'svelte/store'
import { showSettings, showShortcuts } from 'src/components/app/store'
import type { Valueof } from 'src/utils/helpers'
import Cog from 'src/components/icons/cog.svelte'

export const key = {}

export type DispatchClickContext = {
  dispatchClick: () => void
}

export const contextIds = {
  SESSION: 'session',
  WINDOW: 'window',
  TAB: 'tab',
} as const
export type ContextId = Valueof<typeof contextIds>

export type ClickOptionEventHandler = (ev: CustomEvent) => void

export type ContextMenuOption = {
  onClick: ClickOptionEventHandler
  Icon?: null | typeof SvelteComponent
  text: string
  disabled?: boolean
}

export const globalContextMenuOptions: ContextMenuOption[] = [
  {
    onClick: () => {
      showShortcuts.set(true)
    },
    Icon: null,
    text: 'Shortcuts',
  },
  {
    onClick: () => {
      showSettings.set(true)
    },
    Icon: Cog,
    text: 'Settings',
  },
]

type RegisterContextMenuOptions = {
  items: (target: HTMLElement) => ContextMenuOption[]
  onClose?: (target: HTMLElement) => void
}

export type RegisteredContextMenus = Partial<
  Record<ContextId, RegisterContextMenuOptions>
>

const createContextMenuStore = () => {
  const { subscribe, update } = writable<RegisteredContextMenus>({})

  return {
    subscribe,
    register: (contextId: ContextId, options: RegisterContextMenuOptions) =>
      update((existing) => ({
        ...existing,
        [contextId]: options,
      })),
    unregister: (contextId: ContextId) =>
      update((existing) => {
        if (contextId in existing) {
          delete existing[contextId]
        }
        return existing
      }),
  }
}

export const contextMenu = createContextMenuStore()
