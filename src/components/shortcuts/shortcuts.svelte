<script lang="ts">
  import X from 'src/components/icons/x.svelte'
  import Modal from 'src/components/modal/modal.svelte'
  import Kbd from 'src/components/kbd/kbd.svelte'

  export let close: () => void

  const headerId = 'shortcuts-h1'
  const headerHeight = 76
  const th = 'pr-5 py-3 align-top text-right'
  const td = 'text-gray-600'
</script>

<Modal id="shortcuts-modal" {close} ariaLabelledby={headerId}>
  <header
    class="flex flex-row justify-between items-baseline p-5"
    style={`height:${headerHeight}px`}
  >
    <h1 id={headerId} class="text-lg font-semibold mb-6 capitalize">
      Shortcuts
    </h1>
    <button
      on:click={close}
      class="py-2 px-3 rounded-sm"
      title="Close shortcuts"
      aria-label="Close shortcuts"
    >
      <X />
    </button>
  </header>
  <div
    class="px-7 pb-7 overflow-y-auto scroll"
    style={`height:calc(100% - ${headerHeight}px);`}
  >
    <table class="mx-auto">
      <tbody>
        <tr>
          <th class={th}><Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>S</Kbd></th>
          <td class={td}>Opens browser extension</td>
        </tr>
        <tr>
          <th class={th}><Kbd>?</Kbd></th>
          <td class={td}>Toggle shortcuts display</td>
        </tr>
        <tr>
          <th class={th}><Kbd>Esc</Kbd></th>
          <td class={td}>Close modals or close popup</td>
        </tr>
        <tr>
          <th class={th}><Kbd>/</Kbd></th>
          <td class={td}>Focus search bar</td>
        </tr>
        <tr>
          <th class={th}><Kbd>`</Kbd></th>
          <td class={td}>Toggle settings display</td>
        </tr>
      </tbody>
    </table>
  </div>
</Modal>
