<script lang="ts">
  import './range.css'

  export let label: string,
    id: string,
    value: OptionalProp<number> = undefined,
    onChange: svelte.JSX.FormEventHandler<HTMLInputElement>
</script>

<div class="flex items-center">
  <input
    {id}
    class="rounded-lg appearance-none bg-gray-300 h-2 mr-2 dark:bg-gray-500"
    type="range"
    {value}
    on:change={onChange}
    {...$$restProps}
  />
  {#if value}
    <span aria-hidden="true" class="mr-2">{value}</span>
  {/if}
  <label for={id}>{label}</label>
</div>
