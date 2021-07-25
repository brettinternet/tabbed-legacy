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

export type RegisteredContextMenus = Partial<
  Record<ContextId, (target: HTMLElement) => ContextMenuOption[]>
>

const createContextMenuStore = () => {
  const { subscribe, update } = writable<RegisteredContextMenus>({})

  return {
    subscribe,
    register: (
      contextId: ContextId,
      callback: (target: HTMLElement) => ContextMenuOption[]
    ) =>
      update((existing) => ({
        ...existing,
        [contextId]: callback,
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
