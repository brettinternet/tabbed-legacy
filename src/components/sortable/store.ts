import type { SortableEvent } from 'sortablejs'
import { writable } from 'svelte/store'

type Transfer = {
  from: SortableEvent['from']
  items: unknown[]
}

export const transfer = writable<Transfer>()
