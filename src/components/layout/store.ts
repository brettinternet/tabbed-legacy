import { writable } from 'svelte/store'

export const frameStates = {
  TAB: 'tab',
  POPUP: 'popup',
  WINDOW: 'window',
}

const getInitialFrame = () => {
  // if (window.location)
  if (window.opener && window.opener !== window) {
    return frameStates.WINDOW
  }

  return frameStates.POPUP
}

export const frame = writable(getInitialFrame())
