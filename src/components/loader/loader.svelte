<script lang="ts">
  export let message: string | null = 'Loading…',
    size: number = 32
</script>

<div class="flex justify-center items-center space-x-1 text-sm text-gray-700">
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
  {#if message}
    <p class="m-0">{message}</p>
  {/if}
</div>
