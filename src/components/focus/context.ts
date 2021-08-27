import { getContext } from 'svelte'
import { writable, get } from 'svelte/store'
import { uniqueId } from 'lodash'

export const visible = writable(false)
export const focusRingEnabled = writable(false)

export type RingContext = FocusRingContextManager | undefined

const createActiveRingContext = () => {
  const activeRingContextId = writable<string | undefined>()
  const focusRingMap = writable<Record<string, FocusRingContextManager>>()
  const { update } = focusRingMap

  return {
    subscribe: activeRingContextId.subscribe,
    push: (instance: FocusRingContextManager) => {
      update((instances) => {
        activeRingContextId.set(instance.id)
        return {
          ...instances,
          [instance.id]: instance,
        }
      })
    },
    pop: (instanceId: string) => {
      update((instances) => {
        if (instanceId in instances) {
          delete instances[instanceId]
        }
        return instances
      })
    },
    activate: (instanceId: string) => {
      update((instances) => {
        if (instanceId in instances) {
          activeRingContextId.set(instanceId)
          for (const id in instances) {
            if (id !== instanceId) {
              instances[id].hide()
            }
          }
        }
        return instances
      })
    },
    deactive: (instanceId: string) => {
      if (instanceId === get(activeRingContextId)) {
        activeRingContextId.set(undefined)
      }
      update((instances) => instances)
    },
    get: (instanceId: string) => get(focusRingMap)?.[instanceId],
  }
}

export const activeRingContext = createActiveRingContext()

export const key = {}

export const getRingContext = () => getContext<string>(key)

type Offset = {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

type FocusRingShowOpts = {
  className?: string
  offset?: Offset | number
  zIndex?: number
}

type FocusRingAncestry = {
  elements: Element[]
  styles: CSSStyleDeclaration[]
}

/**
 * @source https://github.com/discord/focus-rings/blob/a0ca56d7286c5b54cdf4e200ddb944be4564e52d/src/FocusRingContext.tsx
 */
export class FocusRingContextManager {
  id = uniqueId()
  targetElement?: Element
  targetAncestry?: FocusRingAncestry
  className?: string
  offset: Offset | number = 0
  zIndex?: number
  container?: Element

  constructor(container?: Element) {
    if (container) {
      this.container = container
    }

    activeRingContext.push(this)
  }

  setContainer(element: Element) {
    this.container = element
  }

  get visible() {
    return !!this.targetElement
  }

  showElement(element: Element, opts: FocusRingShowOpts = {}) {
    console.log('element: ', element, this.container, this.id)
    activeRingContext.activate(this.id)
    this.targetElement = element
    this.targetAncestry = this.getElementAncestors(this.targetElement)
    this.className = opts.className
    this.offset = opts.offset ?? 0
    this.zIndex = opts.zIndex
    // setActiveRingContextManager(this)
    visible.set(true)
  }

  hide() {
    // activeRingContext.deactive(this.id)
    this.targetElement = undefined
    this.targetAncestry = undefined
    this.className = undefined
    this.offset = 0
    this.zIndex = undefined
    visible.set(false)
  }

  /**
   * Return the full ancestry of the given element, including both the
   * element ancestors alongside the live computed styles object for
   * each element.
   */
  private getElementAncestors(element?: Element): FocusRingAncestry {
    if (!element) {
      return {
        elements: [],
        styles: [],
      }
    }

    const elements: Element[] = []
    const styles: CSSStyleDeclaration[] = []

    let current: Element | null = element
    while (current !== null) {
      elements.push(current)
      styles.push(window.getComputedStyle(current))
      current = current.parentElement
    }
    return { elements, styles }
  }

  /**
   * To accomodate elements that use z-index to stylistically overlap elements
   * within a single container, this function will calculate the lowest z-index
   * needed to ensure that the focus ring appears at the top of that stacking
   * context. For elements with no stacking context between them and this focus
   * scope's container, no z-index will be applied to the ring.
   */
  private getNextZIndexForAncestry(ancestry: FocusRingAncestry) {
    for (let i = 0; i < ancestry.elements.length; i++) {
      const element = ancestry.elements[i]
      const style = ancestry.styles[i]
      const zIndex = parseInt(style.getPropertyValue('z-index'))
      if (!isNaN(zIndex)) {
        return zIndex + 1
      }

      if (element === this.container) {
        break
      }
    }
  }

  private getBorderRadius(ancestry: FocusRingAncestry) {
    const computed = ancestry.styles[0]?.borderRadius
    if (parseInt(computed) > 0) {
      return computed
    }
  }

  private makePositionFromDOMRect(targetElement: Element) {
    if (this.container) {
      const rect = targetElement.getBoundingClientRect()
      const containerRect = this.container.getBoundingClientRect()
      console.log('containerRect: ', rect.left, containerRect.left)
      const { scrollTop, scrollLeft } = this.container

      let top = 0
      let right = 0
      let bottom = 0
      let left = 0

      if (typeof this.offset === 'number') {
        top = this.offset
        right = this.offset
        bottom = this.offset
        left = this.offset
      } else {
        top = this.offset.top ?? 0
        right = this.offset.right ?? 0
        bottom = this.offset.bottom ?? 0
        left = this.offset.left ?? 0
      }

      return {
        top: targetElement.scrollTop + 'px',
        width: rect.width - (right + left) + 'px',
        height: rect.height - (bottom + top) + 'px',
        left: targetElement.scrollLeft + 'px',
      }
      // return {
      //   top: scrollTop + rect.top - containerRect.top + top + 'px',
      //   width: rect.width - (right + left) + 'px',
      //   height: rect.height - (bottom + top) + 'px',
      //   left: scrollLeft + rect.left - containerRect.left + left + 'px',
      // }
    }

    return {}
  }

  getStyles(): string | undefined {
    if (this.targetElement && this.targetAncestry) {
      const pos = this.makePositionFromDOMRect(this.targetElement)
      console.log('pos: ', pos)
      const styles = {
        ...pos,
        'z-index':
          this.zIndex ?? this.getNextZIndexForAncestry(this.targetAncestry),
        'border-radius': this.getBorderRadius(this.targetAncestry),
      }
      return Object.entries(styles)
        .filter(([, v]) => !!v)
        .map(([key, value]) => `${key}:${value}`)
        .join(';')
    }
  }
}
