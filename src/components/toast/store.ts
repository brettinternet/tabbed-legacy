import type { EventHandler } from 'src/utils/svelte'
import type { Valueof } from 'src/utils/helpers'
import { writable } from 'svelte/store'

export const toastLevels = {
  INFO: 'info',
  SUCCESS: 'success',
  WARN: 'warn',
  ERROR: 'error',
} as const
export type ToastLevel = Valueof<typeof toastLevels>

export type ToastAction = {
  text: string
  onClick: EventHandler<MouseEvent, HTMLButtonElement>
}

export type ToastOptions = {
  title?: string
  message: string
  level?: ToastLevel
  actions?: ToastAction[]
  duration?: number
  dismissable?: boolean
}

export type Toast = {
  id: number
  title?: string
  message: string
  level: ToastLevel
  actions?: ToastAction[]
  duration: number
  dismissable: boolean
}

const defaultOptions: ToastOptions = {
  message: '',
  level: toastLevels.INFO,
  duration: 4000,
  dismissable: true,
}

const createToast = () => {
  const { subscribe, update } = writable<Toast[]>([])
  let count = 0

  return {
    subscribe,
    push: (options: ToastOptions) => {
      const newToast = {
        ...defaultOptions,
        ...options,
        id: ++count,
      } as Toast
      update((toasts) => [...toasts, newToast])
      return count
    },
    update: (id: number, options: ToastOptions) => {
      update((toasts) => {
        const toastIndex = toasts.findIndex((t) => t.id === id)
        if (toastIndex) {
          toasts.splice(toastIndex, 1, {
            ...toasts[toastIndex],
            ...options,
          })
        }
        return toasts
      })
    },
    pop: (id: number) => {
      update((toasts) => toasts.filter((t) => t.id !== id))
    },
    clear: () => {
      update(() => [])
    },
  }
}

export const toast = createToast()
