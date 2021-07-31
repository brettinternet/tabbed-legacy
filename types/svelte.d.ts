import 'svelte2tsx/svelte-jsx'

declare namespace svelte.JSX {
  interface HTMLAttributes {
    onclickAway?: (ev: MouseEvent) => void
    portal?: string | undefined
  }
}
