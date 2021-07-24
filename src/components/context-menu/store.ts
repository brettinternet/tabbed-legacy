export const key = {}

export type DispatchClickContext = {
  dispatchClick: () => void
  target: HTMLElement
}

export const contextIds = {
  GLOBAL: 'global',
  SESSION: 'session',
}

type ClickOptionEvent = CustomEvent<{ target: DispatchClickContext['target'] }>

export type ClickOptionEventHandler = (ev: ClickOptionEvent) => void
