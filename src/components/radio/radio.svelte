<script lang="ts">
  export let label: string,
    id: string,
    onChange: svelte.JSX.FormEventHandler<HTMLInputElement>
</script>

<div class="flex flex-row items-center">
  <input type="radio" class="p-1" {id} on:change={onChange} {...$$restProps} />
  <label for={id} class="pl-1">{label}</label>
</div>
