import { writable, derived } from 'svelte/store'

const createModalWritable = () => {
  const initial = {
    settings: false,
    shortcuts: false,
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
    off: () => {
      set(initial)
    },
  }
}

export const modal = createModalWritable()
export const someModal = derived(modal, ($modal) =>
  Object.values($modal).some(Boolean)
)
