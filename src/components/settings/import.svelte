<script lang="ts">
  import ImportForm from 'src/components/import/form.svelte'
  import H1 from 'src/components/settings/h1.svelte'

  export let headerId: string,
    shouldClose: () => boolean
</script>

<H1 id={headerId}>
  Import
</H1>

<ImportForm bind:shouldClose />
