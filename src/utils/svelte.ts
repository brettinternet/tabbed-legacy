/**
 * From svelte-jsx, however unable to use in `.ts` files
 *
 * Attempts to import declarations from `svelte2tsx/svelte-jsx`
 * cause extending the JSX namespace to fail, and custom directives
 * then can't be typed and throw errors
 * https://github.com/sveltejs/language-tools/blob/620a60eb16c02175245d656af5328ebb44eebeea/packages/svelte2tsx/svelte-jsx.d.ts#L43-L60
 */
export type EventHandler<
  E extends Event = Event,
  T extends EventTarget = HTMLElement
> = (event: E & { currentTarget: EventTarget & T }) => void
