<script lang="ts">
  import Textarea from 'src/components/input/textarea.svelte'
  import Button from 'src/components/button/button.svelte'
  import FileButton from 'src/components/button/file.svelte'
  import { modal } from 'src/components/modal/store'
  import { importSessionsFromText } from 'src/components/import/store'
  import { isPopup } from 'src/components/app/store'

  const getTextArea = (form: HTMLFormElement): HTMLTextAreaElement | null =>
    form.querySelector('textarea')

  export const shouldClose: () => boolean = () => {
    const textarea: HTMLTextAreaElement | null = form ? getTextArea(form) : null
    const shouldConfirm = textarea?.value || files
    let yes = true
    if (shouldConfirm) {
      yes = window.confirm('Discard unsubmitted changes?')
    }
    return yes
  }

  let form: OptionalProp<HTMLFormElement> = undefined,
    files: OptionalProp<FileList> = undefined,
    errorMessage: string | undefined,
    isLoading = false

  const SUPPORTED_TYPES = 'application/json'

  const readFiles = async (files: FileList) => {
    const fileResults = Array.from(files).map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            resolve(reader.result)
          }
          reader.onerror = reject
          reader.readAsText(file)
        })
    )
    return (await Promise.all(fileResults)) as string[]
  }

  const handleSubmit: svelte.JSX.FormEventHandler<HTMLFormElement> =
    async () => {
      if (form && !isLoading) {
        const input = getTextArea(form)
        const text = input?.value
        try {
          isLoading = true
          if (text) {
            await importSessionsFromText(text)
          }
          if (files) {
            const contentsFromFiles = await readFiles(files)
            const requests = contentsFromFiles.map(
              async (content) => await importSessionsFromText(content)
            )
            await Promise.all(requests)
            files = undefined
          }
          isLoading = false
          errorMessage = undefined
        } catch (err) {
          isLoading = false
          errorMessage = err.message
        }
        if (!errorMessage) {
          modal.importer.set(false)
        }
      }
    }

  const handleFileSelect: svelte.JSX.FormEventHandler<HTMLInputElement> = (
    ev
  ) => {
    const input = ev.currentTarget
    if (input.value && input.files) {
      files = input.files
    } else {
      errorMessage = 'No file found'
    }
  }
</script>

<form
  bind:this={form}
  on:submit|preventDefault={handleSubmit}
  class="space-y-3 px-5 pb-5"
>
  <div class="w-full">
    <Textarea
      classNames="w-full max-h-import-textarea"
      aria-label="Import session"
      rows="12"
      placeholder="Paste exported session content"
      aria-disabled={isLoading}
      spellcheck="false"
      wrap="off"
    />
  </div>
  {#if errorMessage}
    <p class="text-red-500">
      {errorMessage}
    </p>
  {/if}
  <div class="flex justify-between items-start">
    <FileButton
      id="importer-file-select"
      accept={SUPPORTED_TYPES}
      onChange={handleFileSelect}
      aria-disabled={isLoading}
      multiple
      secondary>Select file</FileButton
    >
    <Button type="submit" aria-disabled={isLoading}>Import</Button>
  </div>
  {#if isPopup}
    <p class="text-gray-500 text-xs mt-2">
      Using "Select file" may cause the popup to close. Try opening the
      extension in a new tab first.
    </p>
  {/if}
  {#if files}
    <ol>
      {#each files as { name }}
        <li class="mt-2">{name}</li>
      {/each}
    </ol>
  {/if}
</form>
