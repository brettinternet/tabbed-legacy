import { writable } from 'svelte/store'

import { popupUrl, tabUrl, popoutUrl } from 'src/utils/env'

export const isPopout = window.location.href.includes(popoutUrl)
export const isTab = window.location.href.includes(tabUrl)
export const isPopup = window.location.href.includes(popupUrl)

export const showSettings = writable(false)
export const showShortcuts = writable(false)
