<script lang="ts">
  import Header from 'src/components/modal/header.svelte'
  import Modal from 'src/components/modal/modal.svelte'
  import Kbd from 'src/components/kbd/kbd.svelte'

  export let close: () => void

  const headerId = 'shortcuts-h1'
  const headerHeight = 76
  const th = 'pr-5 py-3 align-top text-right'
  const td = 'text-gray-600 dark:text-gray-300'
</script>

<Modal
  {close}
  ariaLabelledby={headerId}
  stretchHeight
  classNames="lg:max-w-screen-sm"
>
  <Header
    headerStyle={`height:${headerHeight}px`}
    onClickClose={close}
    title="Shortcuts"
    {headerId}
  />
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
        <tr>
          <th class={th}><Kbd>i</Kbd></th>
          <td class={td}>Open import form</td>
        </tr>
      </tbody>
    </table>
  </div>
</Modal>
