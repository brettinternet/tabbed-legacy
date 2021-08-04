<script lang="ts">
  import Sortable from 'sortablejs'
  import type { SortableEvent, Options } from 'sortablejs'
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'

  import { transfer } from 'src/components/sortable/store'

  export let options: Options = {
    animation: 150,
    multiDrag: true,
    selectedClass: 'bg-indigo-500',
    group: { name: 'first' },
    // filter: (
    //   event: Event | TouchEvent,
    //   target: HTMLElement,
    //   sortable: Sortable
    // ) => {
    //   console.log('filtering', event, target, sortable)
    //   return false
    // },
    filter: 'a',
  }
  export let items: unknown[] = []

  let target: HTMLElement | undefined, sortable: Sortable | undefined
  const dispatch = createEventDispatcher()

  const moveArrayElement = (
    array: unknown[],
    from: SortableEvent['oldIndex'],
    to: SortableEvent['newIndex']
  ) => {
    if (from && to) {
      const item = array[from]
      array.splice(from, 1)
      array.splice(to, 0, item)
    }
  }

  const moveArrayElements = (
    array: unknown[],
    oldIndicies: SortableEvent['oldIndicies'],
    newIndicies: SortableEvent['newIndicies']
  ) => {
    const itemsNo = oldIndicies.length
    // mappings [ [src idx1, dest idx2], ... , [src idxn, dest idxn]]
    let mappings = new Array(itemsNo)
    for (let i = 0; i < oldIndicies.length; i++) {
      mappings[i] = [oldIndicies[i].index, newIndicies[i].index]
    }
    // first extract items to be moved
    let tmp = new Array(itemsNo)
    for (let i = itemsNo - 1; i >= 0; i--) {
      tmp[i] = array.splice(mappings[i][0], 1)[0]
    }
    // moved items form a continous block, so it is easy to insert them
    array.splice(mappings[0][1], 0, ...tmp)
  }

  onMount(() => {
    if (target) {
      sortable = Sortable.create(target, {
        ...options,
        onRemove: (ev: SortableEvent) => {
          console.log('remove', ev)
          const oldIndex = ev.oldIndex
          if (oldIndex) {
            if (ev.oldIndicies.length > 0) {
              for (let i = ev.oldIndicies.length - 1; i >= 0; i--) {
                items.splice(ev.oldIndicies[i].index, 1)
              }
            } else {
              items.splice(oldIndex, 1)
            }
          }
        },
        onAdd: (ev: SortableEvent) => {
          console.log('add', ev)
          const newIndex = ev.newIndex
          if (newIndex) {
            if (ev.newIndicies.length > 0) {
              for (let i = 0; i < ev.newIndicies.length; i++) {
                items.splice(ev.newIndicies[i].index, 0, $transfer.items[i])
              }
            } else {
              items.splice(newIndex, 0, ...$transfer.items)
            }
          }
        },
        onStart: (ev: SortableEvent) => {
          console.log('start', ev)
          const oldIndex = ev.oldIndex
          if (oldIndex) {
            transfer.set({
              from: ev.from,
              items:
                ev.oldIndicies.length > 0
                  ? ev.oldIndicies.map((i) => items[i.index])
                  : [items[oldIndex]],
            })
          }
        },
        onUpdate: (ev: SortableEvent) => {
          console.log('update', ev)
          // guard against 'update' event fired when source list is reordered,
          // this will mess with 'remove' event fired later
          if (ev.pullMode !== true && ev.oldIndicies.length > 0) {
            moveArrayElements(items, ev.oldIndicies, ev.newIndicies)
          } else {
            moveArrayElement(items, ev.oldIndex, ev.newIndex)
          }
        },
        onEnd: () => {
          dispatch('change')
        },
        onSelect: (ev) => {
          console.log('select', ev)
        },
        onChoose: (ev) => {
          console.log('choose', ev)
        },
      })
    }
  })

  onDestroy(() => {
    sortable?.destroy()
  })
</script>

<div bind:this={target} {...$$restProps}>
  {#each items as item}
    <slot {item} />
  {/each}
</div>
