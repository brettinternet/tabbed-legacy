<script lang="ts">
  import Loader from 'src/components/loader/loader.svelte'

  export let style: string = null,
    label: string = null,
    hideLabel = false
</script>

<main
  {style}
  class="container flex items-center justify-center w-full h-screen"
>
  <Loader {label} {hideLabel} classNames="-translate-y-full" />
</main>
