<!-- https://tailwindcomponents.com/component/toggle-switch -->
<script lang="ts">
  import './toggle.css'

  export let label: string,
    id: string,
    onChange: svelte.JSX.FormEventHandler<HTMLInputElement>
</script>

<div
  class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
>
  <input
    type="checkbox"
    {id}
    class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer dark:border-gray-500 dark:bg-gray-200"
    on:change={onChange}
    {...$$restProps}
  />
  <label
    for={id}
    class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer dark:bg-gray-500"
  />
</div>
<label for={id}>{label}</label>
