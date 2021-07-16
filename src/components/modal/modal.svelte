<script lang="ts">
  import cn from 'classnames'
  import { createFocusTrap } from 'focus-trap'
  import type { FocusTrap } from 'focus-trap'
  import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
  import { onMount, onDestroy } from 'svelte'

  import { clickAway } from 'src/components/modal/click-away'

  export let id = "modal",
    close: () => void,
    ariaLabelledby: string

  let trap: FocusTrap, modal: HTMLElement, main: HTMLElement
  onMount(() => {
    modal = document.getElementById(id)
    main = document.getElementById('main')
    disableBodyScroll(modal)
    trap = createFocusTrap(modal, {
      clickOutsideDeactivates: true
    })
    trap.activate()
    // Hack: `overflow: hidden` on the body isn't enough for the 'popup' to disable body scroll
    main.style.display = 'none'
  })

  onDestroy(() => {
    enableBodyScroll(modal)
    trap.deactivate({
      returnFocus: true,
    })
    main.style.display = ''
  })
</script>

<section
  {id}
  role="dialog"
  aria-modal="true"
  aria-labelledby={ariaLabelledby}
  class={cn(
    'bg-white dark:bg-gray-900 dark:text-white',
    'fixed z-modal top-0 left-0 right-0 bottom-0 overflow-hidden',
    'lg:top-20 lg:left-1/2 lg:right-auto lg:bottom-auto lg:transform lg:-translate-x-1/2 lg:max-w-screen-sm lg:h-modal lg:border lg:border-gray-400 lg:shadow-lg'
  )}
  use:clickAway
  on:clickAway={close}
>
  <slot />
</section>
