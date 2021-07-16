<script lang="ts">
  import './radio.css'

  export let label: string = null,
    id: string,
    onChange: svelte.JSX.FormEventHandler<HTMLInputElement>
</script>

<label class="radio flex items-center relative h-6 cursor-pointer">
  <span class="ml-8">
    {label}
  </span>
  <input
    type="radio"
    class="absolute cursor-pointer appearance-none h-full w-full"
    {id}
    on:change={onChange}
    {...$$restProps}
  />
  <span
    aria-hidden="true"
    class="h-6 w-6 absolute top-0 left-0 rounded-full bg-gray-300 dark:bg-gray-500"
  />
</label>
