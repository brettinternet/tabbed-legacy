<script lang="ts">
  import cn from 'classnames'
  import { linear } from 'svelte/easing'

  import type { Toast, ToastLevel } from 'src/components/toast/store'
  import { tweened } from 'src/utils/motion'
  import { toast, toastLevels } from 'src/components/toast/store'
  import X from 'src/components/icons/x.svelte'

  export let item: Toast
  const {
    id,
    title,
    message,
    level,
    actions,
    duration,
    autoDismiss,
    dismissable,
  } = item

  const progress = autoDismiss
    ? tweened(1, {
        duration: duration,
        easing: linear,
      })
    : undefined

  const close = () => {
    toast.pop(id)
  }

  if (progress) {
    void progress.set(0).then(close)
  }

  const handleMouseover = progress?.pause
  const handleMouseout = () => {
    if (progress) {
      void progress.continue().then(close)
    }
  }

  const getThemedStyles = (level: ToastLevel) => {
    switch (level) {
      case toastLevels.SUCCESS:
        return {
          bg: 'bg-green-200 dark:bg-green-700',
        }
      case toastLevels.WARN:
        return {
          bg: 'bg-yellow-200 dark:bg-yellow-700',
        }
      case toastLevels.ERROR:
        return {
          bg: 'bg-red-200 dark:bg-red-700',
        }
      case toastLevels.INFO:
      default:
        return {
          bg: 'bg-blue-200 dark:bg-blue-700',
        }
    }
  }

  const { bg } = getThemedStyles(level)
</script>

<div
  class={cn(
    'root',
    'w-52 h-auto min-w-5 mb-2 shadow-md rounded-md relative flex overflow-hidden',
    bg
  )}
  on:mouseover={handleMouseover}
  on:mouseout={handleMouseout}
>
  <div class="py-3 px-2 flex-1">
    {#if title}
      <h1>{title}</h1>
    {/if}
    <p>
      {message}
    </p>
    {#if actions}
      <div class="flex justify-end">
        {#each actions as { text, onClick } (text)}
          <button
            on:click={onClick}
            class="px-3 py-2 ml-2 bg-white text-black dark:bg-gray-800 dark:text-gray-300"
          >
            {text}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  {#if dismissable}
    <button
      class="w-8 h-7 my-1.5 flex items-center justify-center"
      on:click={close}
    >
      <X />
    </button>
  {/if}

  <!-- This native element doesn't look great on Firefox... -->
  {#if progress}
    <progress
      class="block appearance-none border-none absolute bottom-0 w-full bg-transparent h-1"
      value={$progress}
      aria-label="Time until autodismiss"
    />
  {/if}
</div>

<style>
  .root {
    will-change: transform, opacity;
    -webkit-tap-highlight-color: transparent;
  }

  progress::-webkit-progress-bar {
    background: transparent;
  }
  progress::-webkit-progress-value {
    background: rgba(0, 0, 0, 0.1);
  }
  progress::-moz-progress-bar {
    background: rgba(0, 0, 0, 0.1);
  }
</style>
