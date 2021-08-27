import { activeRingContext } from 'src/components/focus/context'

const FOCUS_RING_TARGET_CLASSNAME = 'focus-ring-target'

export type FocusRingOptions = {
  instanceId: string
  within?: boolean
  enabled?: boolean
  focused?: boolean
  focusTarget?: HTMLElement
  ringTarget?: HTMLElement
  offset?: number
  ringClassName?: string
  focusClassName?: string
  focusWithinClassName?: string
}

export const focusRing = (
  node: HTMLElement,
  {
    instanceId,
    within = false,
    enabled = true,
    focused,
    focusTarget = node,
    ringTarget = node,
    offset = 0,
    ringClassName,
    focusClassName,
    focusWithinClassName,
  }: FocusRingOptions
) => {
  const ringContext = activeRingContext.get(instanceId)

  const showRingTarget = () => {
    console.log('ringTarget: ', ringTarget)
    ringContext.showElement(ringTarget, {
      className: ringClassName,
      offset,
    })
  }

  if (focused) {
    showRingTarget()
  } else if (focused === false) {
    ringContext.hide()
  }

  const onFocus = (event: FocusEvent) => {
    if (enabled && ringContext) {
      node.classList.add(FOCUS_RING_TARGET_CLASSNAME)
      if (event.currentTarget === event.target) {
        if (focusClassName) {
          node.classList.add(focusClassName)
        }
        showRingTarget()
        console.log('ringContext: ', ringContext.id, ringContext)
      } else {
        if (focusWithinClassName) {
          node.classList.add(focusWithinClassName)
        }
        if (within) {
          showRingTarget()
        }
      }
    }
  }

  const onBlur = () => {
    ringContext.hide()
    node.classList.remove(FOCUS_RING_TARGET_CLASSNAME)
    if (focusClassName) {
      node.classList.remove(focusClassName)
    }
    if (focusWithinClassName) {
      node.classList.remove(focusWithinClassName)
    }
  }

  focusTarget.addEventListener('focusin', onFocus, true)
  focusTarget.addEventListener('focusout', onBlur, true)

  return {
    destroy() {
      ringContext.hide()
      focusTarget.removeEventListener('focusin', onFocus, true)
      focusTarget.removeEventListener('focusout', onBlur, true)
    },
  }
}
