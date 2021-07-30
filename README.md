# Tabbed

[![Test](https://github.com/brettinternet/tabbed/actions/workflows/test.yml/badge.svg)](https://github.com/brettinternet/tabbed/actions/workflows/test.yml)

Keep track of your browser sessions and don't lose your tabs.

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

#### Sessions, windows & tabs

- [ ] Get recently closed sessions and consolidate with previous?
- [ ] multi-select sessions, windows, and tabs
  - [ ] select box (left) - also move active indicator, context menu for tab actions
  - [ ] merge multiple sessions & windows
  - [ ] drag and drop tabs to reorder tabs or assign to new window

#### Layouts

- [ ] Grid layout - [1](https://github.com/isaacHagoel/svelte-dnd-action), [2](https://github.com/vaheqelyan/svelte-grid)
  - [ ] zones to move window groups to? current/minimized/saved

#### App

- [ ] implement undo stack
- [ ] Search tab titles, urls
- [ ] url/regex ignore list
- [ ] load test
- [ ] documentation
- [ ] switch to browser i18n, move/configure texts

#### CI

- [ ] setup CD - [1](https://circleci.com/blog/continuously-deploy-a-chrome-extension/), [2](https://medium.com/slido-dev-blog/chrome-extensions-and-continuous-integration-392206f7e414)

#### Wishlist

- [ ] tab-able elements, tab groups that can change focus with arrows; AKA focus rings/focus layers or groups - [1](https://github.com/discord/focus-rings), [2](https://github.com/davidtheclark/focus-group)
- [ ] Tooltip to suggest shortcut/middle/right click
- [ ] Hide tabs - [1](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/hide)

#### Pending

- [ ] support tab groups

### Related issues

- ~~[Popup window doesn't respect media queries with a dynamically set width](https://bugs.chromium.org/p/chromium/issues/detail?id=1230120)~~ (This issue was resolved in `Chromium 92.0.4515.107`)
- [Safari support](https://github.com/mozilla/webextension-polyfill/issues/234)
- [Manifest v3](https://github.com/extend-chrome/rollup-plugin-chrome-extension/discussions/79)

## Alternatives

- [Tree Style Tab](https://github.com/piroor/treestyletab) - Firefox only
- [Tab Manager Plus](https://github.com/stefanXO/Tab-Manager-Plus) - Firefox/Chromium
- [Tab Session Manager](https://github.com/sienori/Tab-Session-Manager) - Firefox/Chromium
