<script lang="ts">
  export let label: string,
    id: string,
    value: string | number,
    onChange: svelte.JSX.FormEventHandler<HTMLInputElement>
</script>

<div>
  <label for={id} class="block mb-2">{label}</label>
  <input
    {id}
    class="rounded-sm border border-gray-800 px-2 py-1"
    {value}
    on:change={onChange}
    {...$$restProps}
  />
</div>
