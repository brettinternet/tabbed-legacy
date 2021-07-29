<script lang="ts">
  /**
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
   */
  import cn from 'classnames'

  export let onChange: svelte.JSX.FormEventHandler<HTMLInputElement>,
    secondary: OptionalProp<boolean> = undefined,
    id: string,
    accept: string,
    multiple = false

  const handleClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> = () => {
    const fileInput = document.getElementById(id)
    if (fileInput && fileInput.getAttribute('aria-disabled') !== 'true') {
      fileInput.click()
    }
  }
</script>

<button
  on:click|preventDefault={handleClick}
  class={cn(
    'py-1 px-2 rounded-md',
    secondary
      ? 'bg-gray-200 text-black dark:bg-gray-700 dark:text-gray-100'
      : 'bg-blue-600 text-white dark:bg-blue-300 dark:text-black'
  )}
>
  <slot />
</button>

<input
  {id}
  type="file"
  class="hidden"
  on:change={onChange}
  {accept}
  {multiple}
  {...$$restProps}
/>
