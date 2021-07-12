export const layouts = {
  LIST: 'list',
  SHORT_LIST: 'short_list',
  GRID: 'grid',
}

export type Settings = {
  layout: typeof layouts[keyof typeof layouts]
}
