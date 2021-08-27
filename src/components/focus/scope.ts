import { setContext } from 'svelte'
import Ring from 'src/components/focus/ring.svelte'
import { key, FocusRingContextManager } from 'src/components/focus/context'

export const focusScope = (node: HTMLElement) => {
  const ringContext = new FocusRingContextManager(node)
  setContext(key, ringContext.id)
  const ring = new Ring({
    target: node,
  })

  return {
    destroy() {
      ring.$destroy()
    },
  }
}
