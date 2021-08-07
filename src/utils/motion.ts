import type { Tweened } from 'svelte/motion'
import { tweened as nativeTweened } from 'svelte/motion'
import { get } from 'svelte/store'

import { isDefined } from 'src/utils/helpers'

type Options<T> = {
  delay?: number
  duration?: number
  easing?: (t: number) => number
  interpolate?: (a: T, b: T) => (t: number) => T
}

type PausableTweened<T> = {
  pause: () => Promise<void>
  reset: () => Promise<void>
  continue: () => Promise<void>
  replay: () => Promise<void>
  set: (newValue: T, options?: Options<T>) => Promise<void>
} & Tweened<T>

export const tweened = (
  initial: number,
  options: Options<number>
): PausableTweened<number> => {
  const store = nativeTweened<number>(initial, options)
  let lastSet = initial

  const reset = async () => {
    await store.set(initial, { duration: 0 })
  }

  return {
    ...store,
    reset,
    pause: async () => {
      const value = get(store)
      await store.set(value, { duration: 0 })
    },
    continue: async () => {
      const value = get(store)
      const percentageCompleted = (value - initial) / (lastSet - initial)
      if (isDefined(options.duration)) {
        const remaining =
          options.duration - options.duration * percentageCompleted

        await store.set(lastSet, { duration: remaining })
      }
    },
    replay: async () => {
      await reset()
      await store.set(lastSet, options)
    },
    set: async (newValue, options) => {
      lastSet = newValue
      await store.set(newValue, options)
    },
  }
}
