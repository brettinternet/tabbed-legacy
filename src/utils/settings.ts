export type Layout = 'list' | 'short_list' | 'grid'

type LayoutMap = {
  [key: string]: Layout
}

export const layouts: LayoutMap = {
  LIST: 'list',
  SHORT_LIST: 'short_list',
  GRID: 'grid',
}

export type Settings = {
  layout: Layout
}
