<script lang="ts">
  import Cog from 'src/components/icons/cog.svelte'
  import { modal } from 'src/components/modal/store'
  import { undo, redo, canUndoRedo } from 'src/components/app/send'
  import { shortcuts } from 'src/components/settings/hotkeys'
  import Undo from 'src/components/icons/undo.svelte'
  import Redo from 'src/components/icons/redo.svelte'
  import { getMessage } from 'src/utils/i18n'
  import MenuOption from './option.svelte'

  let undoRedoable = {
    undo: false,
    redo: false,
  }
  const fetch = async () => {
    undoRedoable = await canUndoRedo()
  }

  void fetch()

  const handleClickShortcuts = () => {
    modal.shortcuts.set(true)
  }

  const handleClickSettings = () => {
    modal.settings.set(true)
  }
</script>

<MenuOption
  on:click={undo}
  disabled={!undoRedoable.undo}
  Icon={Undo}
  text={getMessage('undo')}
  shortcut={shortcuts.ctrl_z.display}
/>
<MenuOption
  on:click={redo}
  disabled={!undoRedoable.redo}
  Icon={Redo}
  text={getMessage('redo')}
  shortcut={shortcuts.ctrl_y.display}
/>
<MenuOption
  on:click={handleClickShortcuts}
  Icon={null}
  text={getMessage('shortcuts')}
  shortcut={shortcuts.question.display}
/>
<MenuOption
  on:click={handleClickSettings}
  Icon={Cog}
  text={getMessage('settings')}
  shortcut={shortcuts.backtick.display}
/>
