<script lang="ts">
  import { getMessage } from 'src/utils/i18n'
  import X from 'src/components/icons/x.svelte'

  export let onClickClose: () => void,
    title: string,
    headerId: string,
    headerStyle: OptionalProp<string> = undefined
</script>

<header
  class="flex flex-row justify-between items-baseline p-5"
  style={headerStyle}
>
  <h1 id={headerId} class="text-lg font-semibold capitalize">{title}</h1>
  <button
    on:click={onClickClose}
    class="py-2 px-3 rounded-sm"
    title={getMessage('close')}
    aria-label={getMessage('close')}
  >
    <X />
  </button>
</header>
