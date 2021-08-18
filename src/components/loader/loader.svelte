<script lang="ts">
  import cn, { Argument as ClassnamesArgument } from 'classnames'

  import { getMessage } from 'src/utils/i18n'

  export let size = 32,
    label: OptionalProp<string> = undefined,
    classNames: OptionalProp<ClassnamesArgument> = undefined
</script>

<div
  class={cn(
    'flex justify-center items-center space-x-1 text-sm text-gray-700',
    classNames
  )}
  aria-label={getMessage('loading')}
>
  <svg
    fill="none"
    class="animate-spin text-black"
    viewBox="0 0 {size} {size}"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    height={size}
    width={size}
  >
    <path
      clip-rule="evenodd"
      d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
      fill="currentColor"
      fill-rule="evenodd"
    />
  </svg>
  {#if label}
    <p class="m-0">
      {label}
    </p>
  {/if}
</div>
