<script lang="ts">
  import Kbd from 'src/components/kbd/kbd.svelte'
  import Range from 'src/components/range/range.svelte'
  import Toggle from 'src/components/toggle/toggle.svelte'
  import Input from 'src/components/input/input.svelte'
  import Radio from 'src/components/radio/radio.svelte'
  import Button from 'src/components/button/button.svelte'
  import {
    extensionClickActions,
    layouts,
    themes,
    defaultSettings,
  } from 'src/utils/settings'
  import type { Theme, ExtensionClickAction, Layout } from 'src/utils/settings'
  import { updateSettings, settings } from 'src/components/settings/store'
  import { isSidebarSupported } from 'src/components/app/store'
  import { modal } from 'src/components/modal/store'
  import Description from './description.svelte'
  import SectionTitle from './section-title.svelte'

  export let headerId: string

  const handleChangeLayout: svelte.JSX.FormEventHandler<HTMLInputElement> =
    async (ev) => {
      await updateSettings({ layout: ev.currentTarget.value as Layout })
    }

  const handleChangeToggleExtensionClickAction: svelte.JSX.FormEventHandler<HTMLInputElement> =
    async (ev) => {
      const checked = ev.currentTarget.checked
      await updateSettings({
        extensionClickAction: extensionClickActions[checked ? 'TAB' : 'POPUP'],
      })
    }

  const handleChangeRadioExtensionClickAction: svelte.JSX.FormEventHandler<HTMLInputElement> =
    async (ev) => {
      await updateSettings({
        extensionClickAction: ev.currentTarget.value as ExtensionClickAction,
      })
    }

  const handleChangeSaveClosedWindow: svelte.JSX.FormEventHandler<HTMLInputElement> =
    async (ev) => {
      await updateSettings({
        saveClosedWindows: ev.currentTarget.checked,
      })
    }

  const handleChangeTabCountBadge: svelte.JSX.FormEventHandler<HTMLInputElement> =
    async (ev) => {
      await updateSettings({
        showTabCountBadge: ev.currentTarget.checked,
      })
    }

  const handleChangeShortcuts: svelte.JSX.FormEventHandler<HTMLInputElement> =
    async (ev) => {
      await updateSettings({
        shortcuts: ev.currentTarget.checked,
      })
    }

  const handleChangeFontSize: svelte.JSX.FormEventHandler<HTMLInputElement> =
    async (ev) => {
      await updateSettings({
        fontSize: parseInt(ev.currentTarget.value),
      })
    }

  const handleChangePopupDimension: svelte.JSX.FormEventHandler<HTMLInputElement> =
    async (ev) => {
      await updateSettings({
        popupDimensions: {
          ...$settings.popupDimensions,
          [ev.currentTarget.name]: parseInt(ev.currentTarget.value),
        },
      })
    }

  const handleChangeTheme: svelte.JSX.FormEventHandler<HTMLInputElement> =
    async (ev) => {
      await updateSettings({
        theme: ev.currentTarget.value as Theme,
      })
    }

  const handleChangeDebugMode: svelte.JSX.FormEventHandler<HTMLInputElement> =
    async (ev) => {
      await updateSettings({
        debugMode: ev.currentTarget.checked,
      })
    }

  const handleClickReset: svelte.JSX.MouseEventHandler<HTMLButtonElement> =
    async () => {
      await updateSettings(defaultSettings)
    }

  const handleChangeSortFocusedWindowFirst: svelte.JSX.FormEventHandler<HTMLInputElement> =
    async (ev) => {
      await updateSettings({
        sortFocusedWindowFirst: ev.currentTarget.checked,
      })
    }

  const handleOpenShortcuts: svelte.JSX.MouseEventHandler<HTMLButtonElement> =
    () => {
      modal.shortcuts.set(true)
    }
</script>

<h1 id={headerId} class="text-lg font-semibold mb-6 capitalize">Options</h1>

{#if $settings}
  <div class="mb-10">
    <SectionTitle>App</SectionTitle>

    <div class="mb-6">
      <fieldset class="mb-3 space-y-2" aria-describedby="layout-description">
        <legend>Layout</legend>
        <div class="flex flex-row items-center space-x-6">
          <Radio
            id="list-layout-radio"
            label="List"
            onChange={handleChangeLayout}
            value={layouts.LIST}
            checked={$settings.layout === layouts.LIST}
          />
          <Radio
            id="grid-layout-radio"
            label="Grid"
            onChange={handleChangeLayout}
            value={layouts.GRID}
            checked={$settings.layout === layouts.GRID}
          />
        </div>
      </fieldset>
      <Description id="layout-description">Choose a layout.</Description>
    </div>
    <div class="mb-6">
      <fieldset class="mb-3 space-y-2" aria-describedby="theme-description">
        <legend>Theme</legend>
        <div class="flex flex-row items-center space-x-6">
          <Radio
            id="light-theme-radio"
            label="Light"
            onChange={handleChangeTheme}
            value={themes.LIGHT}
            checked={$settings.theme === themes.LIGHT}
          />
          <Radio
            id="dark-theme-radio"
            label="Dark"
            onChange={handleChangeTheme}
            value={themes.DARK}
            checked={$settings.theme === themes.DARK}
          />
          <Radio
            id="system-theme-radio"
            label="System"
            onChange={handleChangeTheme}
            value={themes.SYSTEM}
            checked={$settings.theme === themes.SYSTEM}
          />
        </div>
      </fieldset>
      <Description id="theme-description">
        Changes extension color theme.
      </Description>
    </div>
    <div class="mb-6">
      <div class="mb-3">
        <Range
          id="font-size-range"
          label="Font size"
          onChange={handleChangeFontSize}
          value={$settings.fontSize}
          aria-describedby="font-size-description"
          min="10"
          max="24"
          step="2"
        />
      </div>
      <Description id="font-size-description">
        Changes base font size.
      </Description>
    </div>
    <div class="mb-6">
      <div class="mb-3">
        <Toggle
          id="shortcuts-toggle"
          label="Shortcuts"
          onChange={handleChangeShortcuts}
          checked={$settings.shortcuts}
          aria-describedby="shortcuts-description"
        />
      </div>
      <Description id="shortcuts-description">
        Enables extension shortcuts. Use <Kbd>?</Kbd> when enabled to
        <button
          on:click={handleOpenShortcuts}
          class="text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-500"
          >view shortcuts</button
        >.
      </Description>
    </div>

    <SectionTitle>Session</SectionTitle>

    <div class="mb-6">
      <div class="mb-3">
        <Toggle
          id="save-closed-window-toggle"
          label="Save closed windows"
          onChange={handleChangeSaveClosedWindow}
          checked={$settings.saveClosedWindows}
          aria-describedby="save-closed-window-description"
        />
      </div>
      <Description id="save-closed-window-description">
        Saves a single window session when windows are closed.
      </Description>
    </div>
    <div class="mb-6">
      <div class="mb-3">
        <Toggle
          id="sort-focused-first-toggle"
          label="Sort focused window first"
          onChange={handleChangeSortFocusedWindowFirst}
          checked={$settings.sortFocusedWindowFirst}
          aria-describedby="sort-focused-first-description"
        />
      </div>
      <Description id="sort-focused-first-description">
        Sorts the focused window first in the current session window list.
      </Description>
    </div>

    <SectionTitle>Actions</SectionTitle>

    <div class="mb-6">
      <div class="mb-3">
        {#if isSidebarSupported}
          <fieldset class="mb-3 space-y-2" aria-describedby="theme-description">
            <legend>Theme</legend>
            <div class="flex flex-row items-center space-x-6">
              <Radio
                id="popup-radio"
                label="Popup"
                onChange={handleChangeRadioExtensionClickAction}
                value={extensionClickActions.POPUP}
                checked={$settings.extensionClickAction ===
                  extensionClickActions.POPUP}
              />
              <Radio
                id="tab-radio"
                label="Tab"
                onChange={handleChangeRadioExtensionClickAction}
                value={extensionClickActions.TAB}
                checked={$settings.extensionClickAction ===
                  extensionClickActions.TAB}
              />
              <Radio
                id="sidebar-radio"
                label="Sidebar"
                onChange={handleChangeRadioExtensionClickAction}
                value={extensionClickActions.SIDEBAR}
                checked={$settings.extensionClickAction ===
                  extensionClickActions.SIDEBAR}
              />
            </div>
          </fieldset>
        {:else}
          <Toggle
            id="browser-action-toggle"
            label="Open in tab"
            onChange={handleChangeToggleExtensionClickAction}
            checked={$settings.extensionClickAction ===
              extensionClickActions.TAB}
            aria-describedby="browser-action-description"
          />
        {/if}
      </div>
      <Description id="browser-action-description">
        Opens the extension in a tab instead of a popup.
      </Description>
    </div>
    <div class="mb-6">
      <div class="mb-3">
        <Toggle
          id="tab-count-badge-toggle"
          label="Show tab count badge"
          onChange={handleChangeTabCountBadge}
          checked={$settings.showTabCountBadge}
          aria-describedby="tab-count-badge-description"
        />
      </div>
      <Description id="tab-count-badge-description">
        Shows a badge count of the total number of tabs.
      </Description>
    </div>

    <SectionTitle>Popup</SectionTitle>

    <div class="mb-6">
      <div class="flex flex-row mb-3 space-x-6">
        <div>
          <Input
            id="popup-width-input"
            label="Popup width"
            name="width"
            type="number"
            onChange={handleChangePopupDimension}
            value={$settings.popupDimensions.width}
            aria-describedby="popup-dimension-description"
            min="300"
            max="800"
            step="25"
          />
        </div>
        <div>
          <Input
            id="popup-height-input"
            label="Popup height"
            name="height"
            type="number"
            onChange={handleChangePopupDimension}
            value={$settings.popupDimensions.height}
            aria-describedby="popup-dimension-description"
            min="300"
            max="600"
            step="25"
          />
        </div>
      </div>
      <Description id="popup-dimension-description">
        Changes popup dimensions. Browsers limit the permissable dimensions of
        popups.
      </Description>
    </div>

    <SectionTitle>Other</SectionTitle>

    <div class="mb-6">
      <div class="mb-3">
        <Toggle
          id="debug-mode-toggle"
          label="Debug mode"
          onChange={handleChangeDebugMode}
          checked={$settings.debugMode}
          aria-describedby="debug-mode-description"
        />
      </div>
      <Description id="debug-mode-description">
        Enables verbose debugging in the console.
      </Description>
    </div>
    <div class="mb-6">
      <div class="mb-3">
        <Button onClick={handleClickReset}>Reset settings</Button>
      </div>
      <Description id="debug-mode-description">
        Restores all settings to default values.
      </Description>
    </div>
  </div>
{/if}
