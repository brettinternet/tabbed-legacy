<script lang="ts">
  import { onMount } from 'svelte'

  import Button from 'src/components/button/button.svelte'
  import Textarea from 'src/components/input/textarea.svelte'
  import { downloadSessions } from 'src/components/sessions/store'
  import { getAllSessions } from 'src/components/settings/handlers'
  import copy from 'copy-to-clipboard'
  import { isDefined, numberWithCommas, parseNum } from 'src/utils/helpers'

  export let headerId: string

  let errorMessage: string | undefined,
    format: HTMLSelectElement | null,
    exportString: string,
    sessionCount: number,
    sizeApproximateKb: string,
    isLoading = true,
    isCopied = false
  const formats = ['json']

  onMount(async () => {
    const sessions = await getAllSessions()
    sessionCount = sessions.length
    exportString = JSON.stringify(
      {
        sessions,
      },
      null,
      '\t'
    )

    // https://stackoverflow.com/a/63805778
    const size = new TextEncoder().encode(exportString).length
    const sizeKb = size / 1024
    if (sizeKb) {
      const sizeKbStr = sizeKb.toString()
      const sizeNum = parseNum(sizeKbStr.slice(0, sizeKbStr.indexOf('.')))
      if (sizeNum) {
        sizeApproximateKb = numberWithCommas(sizeNum)
      }
    }
    isLoading = false
  })

  const handleCopyToClipboard: svelte.JSX.MouseEventHandler<HTMLButtonElement> =
    () => {
      if (exportString) {
        copy(exportString)
        isCopied = true
      }
    }
  const handleSaveToFile: svelte.JSX.MouseEventHandler<HTMLButtonElement> =
    async () => {
      await downloadSessions({})
    }
</script>

<h1 id={headerId} class="text-lg font-semibold mb-6 capitalize">Export</h1>

<div class="space-y-3">
  <div>
    <label for="export-format" class="block mb-2">Format</label>
    <select
      bind:this={format}
      id="export-format"
      name="format"
      class="block px-2 py-1"
      disabled
    >
      {#each formats as f}
        <option value={f}>{f}</option>
      {/each}
    </select>
  </div>

  <Textarea
    classNames="w-full"
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
      {sizeApproximateKb} kB
    </p>
  {/if}
  <div class="flex flex-row items-center justify-end space-x-2">
    <Button onClick={handleCopyToClipboard} secondary>Copy to clipboard</Button>
    <Button onClick={handleSaveToFile}>Save to file</Button>
  </div>
  {#if isCopied}
    <p class="text-gray-500">&#x2713; Copied</p>
  {/if}
</div>
