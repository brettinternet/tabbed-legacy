<script lang="ts">
  export let id: string
</script>

<p {id} class="text-gray-600">
  <slot />
</p>
