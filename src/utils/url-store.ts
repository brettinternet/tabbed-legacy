import { derived, writable } from 'svelte/store'

const href = writable(window.location.href)

// eslint-disable-next-line @typescript-eslint/unbound-method
const originalPushState = history.pushState
// eslint-disable-next-line @typescript-eslint/unbound-method
const originalReplaceState = history.replaceState

const updateHref = () => href.set(window.location.href)

history.pushState = function(...args) {
  originalPushState.apply(this, args)
  updateHref()
}

history.replaceState = function(...args) {
  originalReplaceState.apply(this, args)
  updateHref()
}

window.addEventListener('popstate', updateHref)
window.addEventListener('hashchange', updateHref)

export const url = derived(href, $href => new URL($href))
