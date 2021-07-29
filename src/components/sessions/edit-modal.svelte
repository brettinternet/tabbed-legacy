<script lang="ts">
  import { onMount } from 'svelte'

  import Modal from 'src/components/modal/modal.svelte'
  import Header from 'src/components/modal/header.svelte'
  import Input from 'src/components/input/input.svelte'
  import Button from 'src/components/button/button.svelte'
  import type { Session } from 'src/utils/browser/storage'
  import { modal } from 'src/components/modal/store'

  export let onSubmit: (sessionId: string, title: string) => Promise<void>,
    close: () => void,
    session: Session

  onMount(() => {
    modal.sessionEdit.set(true)
  })

  const MAX_LENGTH = 60
  let errorMessage: string | undefined, form: HTMLFormElement | undefined

  const getNameInput = (form: HTMLFormElement): HTMLInputElement | null =>
    form.querySelector('[type="text"]')

  const handleClose = () => {
    const input: HTMLInputElement | null = form ? getNameInput(form) : null
    const shouldConfirm =
      input && (input.value || session.title) && input.value !== session.title
    let yes = true
    if (shouldConfirm) {
      yes = window.confirm('Discard unsaved changes?')
    }
    if (yes) {
      close()
      modal.sessionEdit.set(false)
    }
  }

  const handleSubmit: svelte.JSX.FormEventHandler<HTMLFormElement> =
    async () => {
      if (form) {
        const input = getNameInput(form)
        const value = input?.value || ''
        if (value.length > MAX_LENGTH) {
          errorMessage = `Set a title less than ${MAX_LENGTH} characters`
        }
        try {
          await onSubmit(session.id, value)
          errorMessage = undefined
        } catch (err) {
          errorMessage = err.message
        }
        if (!errorMessage) {
          close()
          modal.sessionEdit.set(false)
        }
      }
    }

  const headerId = 'session-editing'
</script>

<Modal
  close={handleClose}
  ariaLabelledby={headerId}
  classNames="lg:max-w-screen-xxs"
>
  <Header onClickClose={handleClose} title="Session" {headerId} />
  <form
    bind:this={form}
    on:submit|preventDefault={handleSubmit}
    class="space-y-3 mx-auto max-w-screen-xxs px-5 pb-5"
  >
    <div class="w-full">
      <Input
        label="Name"
        type="text"
        value={session.title}
        classNames="w-full"
        maxlength={MAX_LENGTH}
      />
    </div>
    {#if errorMessage}
      <p class="text-red-500">
        {errorMessage}
      </p>
    {/if}
    <div class="flex justify-end">
      <Button type="submit">Save</Button>
    </div>
  </form>
</Modal>
