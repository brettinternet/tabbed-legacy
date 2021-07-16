# Tabbed

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

Navigate to `chrome://extensions`, enable "Developer mode", select "Load unpacked" and open the `dist/` folder. See [Chrome's developer instructions](https://developer.chrome.com/docs/extensions/mv3/getstarted/).

### Test

```
npm test
```

### Notes

- [Differences between API implementations](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Differences_between_API_implementations)
- [rollup-plugin-chrome-extension supports Firefox >=v89](https://github.com/extend-chrome/rollup-plugin-chrome-extension#%EF%B8%8F-what-about-firefox-support)

### Todo

#### Windows & tabs

- [ ] Window titles based on predominant hostnames and language like "& 4 more"
- [ ] Window actions: focus/minimize, close - focused/minimized indicators
- [ ] Tab actions: close, pin, deactivate?, middle click create new tab - pinned/active indicators
- [ ] multi-select tabs and windows, shift click
- [ ] Add focus/active listeners to background, refresh window/tab list on window/tab changes
- [ ] save tab groups
- [ ] select box (left), context menu for tab actions

#### Sessions

- [ ] Save session (window or entire group of windows), restore sessions (with incognito state intact)
- [ ] Automatically save sessions (on window close, regular save)

#### Layouts

- [ ] Grid layout ([1](https://github.com/isaacHagoel/svelte-dnd-action), [2](https://github.com/vaheqelyan/svelte-grid))
- [ ] resize boxes
- [ ] zones to move window groups to? current/minimized/saved

#### Search

- [ ] Search tab titles, urls

#### Accessibility

- [ ] tab-able elements, tab groups that can change focus with arrows

#### App

- [ ] highlight duplicate tabs
- [ ] save last selected session
- [ ] allow to optionally save private windows

#### Related issues

- [Popup window doesn't respect media queries with a dynamically set width](https://bugs.chromium.org/p/chromium/issues/detail?id=1230120)
  - The workaround for this Chrome issue has been to make the popup utilize the smallest width's media query. This is a very minor issue.

## Alternatives

- [Tree Style Tab](https://github.com/piroor/treestyletab) - Firefox only
- [Tab Manager Plus](https://github.com/stefanXO/Tab-Manager-Plus) - Firefox/Chromium
- [Tab Session Manager](https://github.com/sienori/Tab-Session-Manager) - Firefox/Chromium
