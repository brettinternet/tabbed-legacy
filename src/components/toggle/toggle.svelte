<!-- https://tailwindcomponents.com/component/toggle-switch -->
<script lang="ts">
  import cn from 'classnames'

  import './toggle.css'

  export let label: string,
    id: string,
    labelClassNames: string = null,
    onChange: svelte.JSX.FormEventHandler<HTMLInputElement>
</script>

<div
  class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
>
  <input
    type="checkbox"
    {id}
    class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer"
    on:change={onChange}
    {...$$restProps}
  />
  <label
    for={id}
    class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
  />
</div>
<label for={id} class={cn('text-xs', labelClassNames)}>{label}</label>
