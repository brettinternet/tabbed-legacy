export const popupUrl = 'main/index.html?mode=popup'
export const sidebarUrl = 'main/index.html?mode=sidebar'
export const tabUrl = 'main/index.html?mode=tab' // or no query at all
export const popoutUrl = 'main/index.html?mode=popout'

export const repoUrl = 'https://github.com/brettinternet/tabbed'
export const licenseUrl = `${repoUrl}/blob/main/LICENSE.md`
export const privacyPolicyUrl = `${repoUrl}/blob/main/PRIVACYPOLICY.md`

export const buildTime = process.env.BUILD_TIME
export const buildVersion = process.env.BUILD_VERSION
export const appName = process.env.APP_NAME || 'tabbed'
export const isProd = process.env.NODE_ENV === 'production'
