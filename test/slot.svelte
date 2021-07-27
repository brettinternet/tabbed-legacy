<script lang="ts">
  /**
   * There's no programmatic way to insert a value into a slot
   * in order to customize components in tests
   * https://github.com/sveltejs/svelte/pull/4296
   * https://github.com/testing-library/svelte-testing-library/issues/48
   * @usage https://sveltesociety.dev/recipes/testing-and-debugging/unit-testing-svelte-component/
   */
  import type { SvelteComponent } from 'svelte'

  export let component: SvelteComponent,
    text: OptionalProp<string> = undefined,
    props: OptionalProp<unknown> = undefined,
    child: OptionalProp<SvelteComponent> = undefined,
    childProps: OptionalProp<Record<string, unknown>> = undefined
</script>

<svelte:component this={component} {...props}>
  {#if child}
    <svelte:component this={child} {...childProps} />
  {:else}
    {text}
  {/if}
</svelte:component>
