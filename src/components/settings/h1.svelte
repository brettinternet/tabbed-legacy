<script lang="ts">
  export let id: string
</script>

<h1 {id} class="text-lg font-semibold mb-6 capitalize">
  <slot />
</h1>
