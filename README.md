# Tabbed

[![Test](https://github.com/brettinternet/tabbed/actions/workflows/test.yml/badge.svg)](https://github.com/brettinternet/tabbed/actions/workflows/test.yml)

Keep tabs on your browser sessions and don't lose track of websites you've tabbed.

## Privacy

See this extension's [Privacy Policy](./PRIVACYPOLICY.md).

## Develop

### Setup

```
npm install
```

### Run

```
npm start
```

#### Chrome

Navigate to `chrome://extensions`, enable "Developer mode", select "Load unpacked" and open the `dist/` folder. See [Chrome's developer instructions](https://developer.chrome.com/docs/extensions/mv3/getstarted/).

#### Firefox

Navigate to `about:debugging`, select "This Firefox", "Load Temporary Addon-on..." and open the `dist/` folder. See [Firefox's Extension Workshop](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/).

### Test

```
npm test
```

### Notes

- [Differences between API implementations](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Differences_between_API_implementations)
- [Browser support for JavaScript APIs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs)
- [rollup-plugin-chrome-extension supports Firefox >=v89](https://github.com/extend-chrome/rollup-plugin-chrome-extension#%EF%B8%8F-what-about-firefox-support)

### Todo

#### Windows & tabs

- [ ] multi-select tabs and windows, shift click
- [ ] save tab groups
- [ ] select box (left) - also move active indicator, context menu for tab actions

#### Sessions

- [ ] Add rename modal and form
- [ ] Get recently closed sessions and consolidate with previous?
- [ ] Give previous sessions a name with predominant tabs, like "& 4 more"
- [ ] merge multiple sessions
- [ ] merge multiple windows

#### Layouts

- [ ] Grid layout ([1](https://github.com/isaacHagoel/svelte-dnd-action), [2](https://github.com/vaheqelyan/svelte-grid))
  - [ ] resize boxes
  - [ ] zones to move window groups to? current/minimized/saved

#### Search

- [ ] Search tab titles, urls

#### Accessibility

- [ ] tab-able elements, tab groups that can change focus with arrows (AKA focus rings/focus layers or groups ([1](https://github.com/discord/focus-rings), [2](https://github.com/davidtheclark/focus-group)))

#### App

- [ ] highlight duplicate tabs
- [ ] save last selected session (?)
- [ ] allow to optionally save private windows
- [ ] implement undo stack
- [ ] export/import & backup (download export onclick)
- [ ] save window popout position/size

### Related issues

- ~~[Popup window doesn't respect media queries with a dynamically set width](https://bugs.chromium.org/p/chromium/issues/detail?id=1230120)~~ (This issue was resolved in `Chromium 92.0.4515.107`)

## Alternatives

- [Tree Style Tab](https://github.com/piroor/treestyletab) - Firefox only
- [Tab Manager Plus](https://github.com/stefanXO/Tab-Manager-Plus) - Firefox/Chromium
- [Tab Session Manager](https://github.com/sienori/Tab-Session-Manager) - Firefox/Chromium
