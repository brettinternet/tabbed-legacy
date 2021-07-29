import { writable, derived } from 'svelte/store'

const createModalWritable = () => {
  const initial = {
    settings: false,
    shortcuts: false,
    sessionEdit: false,
    importer: false,
  }
  const { subscribe, set, update } = writable(initial)
  const setter = (key: keyof typeof initial) => (value: boolean) => {
    update(() => ({
      // reset other values, exclusive state only
      ...initial,
      [key]: value,
    }))
  }
  const toggler = (key: keyof typeof initial) => () => {
    update((current) => ({
      ...initial,
      [key]: !current[key],
    }))
  }
  return {
    subscribe,
    settings: {
      set: setter('settings'),
      toggle: toggler('settings'),
    },
    shortcuts: {
      set: setter('shortcuts'),
      toggle: toggler('shortcuts'),
    },
    sessionEdit: {
      set: setter('sessionEdit'),
      toggle: toggler('sessionEdit'),
    },
    importer: {
      set: setter('importer'),
      toggle: toggler('importer'),
    },
    off: () => {
      set(initial)
    },
  }
}

export const modal = createModalWritable()
export const someModal = derived(modal, ($modal) =>
  Object.values($modal).some(Boolean)
)
