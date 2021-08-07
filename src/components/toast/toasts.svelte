<script lang="ts">
  /**
   * @accessibility status messages
   * `role="status"` https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22.html
   * Using the status role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_status_role
   * Using the alert role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_alert_role
   * Alert role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Alert_Role
   */
  import { fly, scale } from 'svelte/transition'
  import { flip } from 'svelte/animate'

  import type { ToastLevel } from 'src/components/toast/store'
  import { toast, toastLevels } from 'src/components/toast/store'
  import Item from './item.svelte'

  const shouldInterruptAssistive = (level: ToastLevel) =>
    level === toastLevels.ERROR
</script>

{#if $toast.length > 0}
  <ul
    class="fixed left-1/2 bottom-3 transform -translate-x-1/2 m-0 p-0 list-none z-toast"
  >
    {#each $toast as item (item.id)}
      <li
        in:fly={{ y: 200, opacity: 0.5 }}
        out:scale={{ duration: 150, opacity: 0 }}
        animate:flip={{ duration: 200 }}
        role={shouldInterruptAssistive(item.level) ? 'alert' : 'status'}
        aria-live={shouldInterruptAssistive(item.level)
          ? 'assertive'
          : 'polite'}
        aria-atomic="true"
      >
        <Item {item} />
      </li>
    {/each}
  </ul>
{/if}
