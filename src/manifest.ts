import type { ManifestV3 } from 'rollup-plugin-chrome-extension'

console.log('NODE_ENV', process.env.NODE_ENV)

const config: ManifestV3 = {
  manifest_version: 3,
  name: process.env.NODE_ENV === 'production' ? 'Tabbed' : 'Tabbed (dev)',
  description: 'For the folks who have a lot of tabs open',
  version: '0.0.1',
  background: {
    scripts: ['background/index.ts'],
  },
  browser_action: {
    default_popup: 'main/index.html',
  },
  sidebar_action: {
    default_panel: 'main/index.html',
  },
  default_locale: 'en',
  permissions: ['tabs', 'contextMenus', 'storage'],
  commands: {
    _execute_browser_action: {
      suggested_key: {
        default: 'Ctrl+Shift+S',
      },
    },
  },
  browser_specific_settings: {
    gecko: {
      id: '{6c352909-bfa6-4143-98d2-8bf9441dc7da}',
    },
  },
  icons: {
    '16': 'icons/icon-16x16.png',
    '32': 'icons/icon-32x32.png',
  },
}

export default config
