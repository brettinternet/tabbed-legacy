<script lang="ts">
  import cn from 'classnames'
  import { linear } from 'svelte/easing'

  import type { Toast, ToastLevel } from 'src/components/toast/store'
  import { tweened } from 'src/utils/motion'
  import { toast, toastLevels } from 'src/components/toast/store'
  import X from 'src/components/icons/x.svelte'

  export let item: Toast

  const tweenedProgress = tweened(1, {
    duration: item.duration,
    easing: linear,
  })

  const close = () => {
    toast.pop(item.id)
  }
  tweenedProgress.set(0).then(close)

  const handleMouseover = tweenedProgress.pause
  const handleMouseout = async () => {
    tweenedProgress.continue().then(close)
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

  const { bg } = getThemedStyles(item.level)
</script>

<div
  class={cn(
    'root',
    'w-52 h-auto min-w-5 mb-2 shadow-md rounded-md relative flex items-center overflow-hidden',
    bg
  )}
  on:mouseover={handleMouseover}
  on:mouseout={handleMouseout}
>
  <div class="py-3 px-2 flex-1">
    {#if item.title}
      <h1>{item.title}</h1>
    {/if}
    <p>
      {item.message}
    </p>
    {#if item.actions}
      <div class="flex justify-end">
        {#each item.actions as { text, onClick } (text)}
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

  {#if item.dismissable}
    <button class="w-8 h-8 flex items-center justify-center" on:click={close}>
      <X />
    </button>
  {/if}

  <!-- This native element doesn't look great on Firefox... -->
  <progress
    class="block appearance-none border-none absolute bottom-0 w-full bg-transparent h-1"
    value={$tweenedProgress}
  />
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
