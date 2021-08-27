<script lang="ts">
  import { getContext } from 'svelte'
  import cn from 'classnames'

  import { focusRing } from 'src/components/focus/focus-ring'
  import { key, getRingContext } from 'src/components/focus/context'

  type ButtonVariants = 'primary' | 'secondary' | 'transparent'

  export let onClick: OptionalProp<
      svelte.JSX.MouseEventHandler<HTMLButtonElement>
    > = undefined,
    variant: OptionalProp<ButtonVariants> = undefined

  const variantClasses = (variant: ButtonVariants) => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white dark:bg-blue-300 dark:text-black'
      case 'secondary':
        return 'bg-gray-200 text-black dark:bg-gray-700 dark:text-gray-100'
    }
  }
  const instanceId = getContext<string>(key)
  console.log('instanceId: ', instanceId)
</script>

<button
  use:focusRing={{ instanceId }}
  on:click={onClick}
  class={cn(
    variant && 'py-1 px-2 rounded-md',
    variant && variantClasses(variant)
  )}
  {...$$restProps}
>
  <slot />
</button>
