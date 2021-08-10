<script lang="ts">
  import Modal from 'src/components/modal/modal.svelte'
  import Header from 'src/components/modal/header.svelte'
  import { modal } from 'src/components/modal/store'
  import ImportForm from 'src/components/import/form.svelte'

  let shouldClose: (() => boolean) | undefined = undefined

  const handleClose = () => {
    if (!shouldClose || shouldClose()) {
      modal.importer.set(false)
    }
  }

  const headerId = 'import-session'
</script>

<Modal
  close={handleClose}
  ariaLabelledby={headerId}
  classNames="lg:max-w-screen-sm"
  focusSelector="[aria-label='Import session']"
>
  <Header onClickClose={handleClose} title="Import" {headerId} />
  <ImportForm bind:shouldClose />
</Modal>
