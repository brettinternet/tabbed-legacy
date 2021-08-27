<script lang="ts">
  import { onMount } from 'svelte'
  import copy from 'copy-to-clipboard'

  import Button from 'src/components/button/button.svelte'
  import Select from 'src/components/select/select.svelte'
  import Textarea from 'src/components/input/textarea.svelte'
  import { downloadSessions } from 'src/components/sessions/send'
  import { getAllSessions } from 'src/components/settings/export/send'
  import { isDefined, numberWithCommas, parseNum } from 'src/utils/helpers'
  import type { Valueof } from 'src/utils/helpers'
  import type { Session } from 'src/utils/browser/storage'
  import H1 from 'src/components/settings/h1.svelte'

  export let headerId: string

  let errorMessage: string | undefined,
    format: HTMLSelectElement | undefined,
    sessions: Session[] | undefined,
    exportString: string,
    sessionCount: number,
    sizeKb: number,
    sizeApproximateKb: string,
    isLoading = true,
    isCopied = false

  const formats = {
    JSON: 'json',
  }

  const handleChangeFormat = () => {
    if (sessions) {
      const selectedFormat = format?.value as Valueof<typeof formats>
      switch (selectedFormat) {
        case 'json':
        default:
          exportString = JSON.stringify(
            {
              sessions,
            },
            null,
            '\t'
          )
          break
      }

      // https://stackoverflow.com/a/63805778
      const size = new TextEncoder().encode(exportString).length
      sizeKb = size / 1024
      if (sizeKb) {
        const sizeKbStr = sizeKb.toString()
        const sizeNum = parseNum(sizeKbStr.slice(0, sizeKbStr.indexOf('.')))
        if (sizeNum) {
          sizeApproximateKb = numberWithCommas(sizeNum)
        }
      }
      isLoading = false
    }
  }

  onMount(async () => {
    sessions = await getAllSessions()
    sessionCount = sessions.length
    handleChangeFormat()
  })

  const handleCopyToClipboard: svelte.JSX.MouseEventHandler<HTMLButtonElement> =
    (ev) => {
      ev.preventDefault()
      if (exportString) {
        copy(exportString)
        isCopied = true
      }
    }
  const handleSaveToFile: svelte.JSX.FormEventHandler<HTMLFormElement> = async (
    ev
  ) => {
    ev.preventDefault()
    await downloadSessions({})
  }
</script>

<H1 id={headerId}>
  Export
</H1>

<form on:submit={handleSaveToFile} class="space-y-3">
  <div>
    <Select
      label="Format"
      options={Object.values(formats)}
      selected={formats.JSON}
      id="export-format"
      name="format"
      required
      disabled
      onBlur={handleChangeFormat}
      bind:ref={format}
    />
  </div>

  <Textarea
    classNames="scroll w-full"
    rows="15"
    label="Config"
    id="export-config"
    readonly
    spellcheck="false"
    placeholder={isLoading ? 'Loading...' : 'No sessions'}
    value={exportString}
  />

  {#if errorMessage}
    <p class="text-red-500">
      {errorMessage}
    </p>
  {/if}

  {#if isDefined(sessionCount) && sizeApproximateKb}
    <p class="text-right text-gray-500">
      <span class="mr-1">
        {sessionCount}
        {#if sessionCount === 1}
          session,
        {:else}
          sessions,
        {/if}
      </span>
      approx. {sizeApproximateKb} kB
    </p>
  {/if}
  <div class="flex flex-row items-center justify-end space-x-2">
    <div class="flex items-center space-x-2">
      {#if isCopied}
        <p class="text-gray-500 text-right">&#x2713; Copied</p>
      {/if}
      <Button onClick={handleCopyToClipboard} secondary
        >Copy to clipboard</Button
      >
    </div>
    <Button type="submit">Save to file</Button>
  </div>
  {#if sizeKb > 500}
    <p class="text-gray-500 text-right">
      Copying a large amount of text may cause issues on your system.
    </p>
  {/if}
</form>
