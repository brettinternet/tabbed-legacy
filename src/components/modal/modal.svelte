<script lang="ts">
  import cn, { Argument as ClassnamesArgument } from 'classnames'
  import { createFocusTrap } from 'focus-trap'
  import type { FocusTrap } from 'focus-trap'
  import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
  import { onMount, onDestroy } from 'svelte'

  import { log } from 'src/utils/logger'
  import { isPopup } from 'src/components/app/store'
  import { clickAway } from 'src/utils/click-away'
  import { portal } from 'src/utils/portal'

  export let close: () => void,
    ariaLabelledby: string,
    stretchHeight = false,
    classNames: OptionalProp<ClassnamesArgument> = undefined

  let trap: FocusTrap, modal: HTMLElement | null, main: HTMLElement | null

  onMount(() => {
    main = document.getElementById('main')
    if (main) {
      if (isPopup) {
        // Hack: `overflow: hidden` on the body isn't enough for the 'popup' to disable body scroll
        main.style.display = 'none'
      }
      if (modal) {
        try {
          disableBodyScroll(modal)
          trap = createFocusTrap(modal, {
            // Escape should destroy the modal first or blur an input
            escapeDeactivates: false,
          })
          trap.activate()
        } catch (err) {
          log.error(err)
        }
      }
    }
  })

  onDestroy(() => {
    if (modal) {
      try {
        enableBodyScroll(modal)
        if (trap) {
          trap.deactivate({
            returnFocus: true,
          })
        }
      } catch (err) {
        log.error(err)
      }
    }
    if (isPopup && main) {
      main.style.display = ''
    }
  })
</script>

<section
  bind:this={modal}
  role="dialog"
  aria-modal="true"
  aria-labelledby={ariaLabelledby}
  class={cn(
    'modal bg-white dark:bg-gray-900 dark:text-white',
    'fixed z-modal top-0 left-0 right-0 bottom-0 overflow-hidden',
    'lg:top-20 lg:left-1/2 lg:right-auto lg:bottom-auto lg:transform lg:-translate-x-1/2 lg:border lg:border-gray-400 lg:shadow-lg lg:rounded-sm lg:dark:border-gray-600',
    'flex flex-col lg:w-full',
    stretchHeight ? 'lg:h-full lg:max-h-modal' : 'lg:h-auto',
    classNames
  )}
  use:portal
  use:clickAway
  on:clickAway={close}
>
  <slot />
</section>
