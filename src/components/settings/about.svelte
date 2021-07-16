<script lang="ts">
  import { locale } from 'svelte-i18n'
  import {
    appName,
    buildVersion,
    repoUrl,
    licenseUrl,
    privacyPolicyUrl,
  } from 'src/utils/env'
  import A from 'src/components/anchor/anchor.svelte'

  export let headerId: string

  const thStyle = 'min-width:80px;'
  const thClassName =
    'text-gray-500 font-light text-left min-w-min pr-1 align-top dark:text-gray-300'
</script>

<h1 id={headerId} class="text-lg font-semibold mb-6 capitalize">
  About {appName}
</h1>

<table class="font-light">
  <caption class="font-medium text-left mb-2">Client</caption>
  <tbody>
    <tr>
      <th style={thStyle} class={thClassName}>Version</th>
      <td>{buildVersion}</td>
    </tr>
    <tr>
      <th style={thStyle} class={thClassName}>Language</th>
      <td>{$locale}</td>
    </tr>
    <tr>
      <th style={thStyle} class={thClassName}>User Agent</th>
      <td>{navigator.userAgent}</td>
    </tr>
    <tr>
      <th style={thStyle} class={thClassName}>Platform</th>
      <td>{window.navigator.platform}</td>
    </tr>
  </tbody>
</table>

<hr class="my-6" />

<h2 class="font-medium text-left mb-2">Resources</h2>

<ul class="font-light">
  <li>
    <A href={repoUrl} newTab>Source</A>
  </li>
  <li>
    <A href={licenseUrl} newTab>License</A>
  </li>
  <li>
    <A href={privacyPolicyUrl} newTab>Privacy Policy</A>
  </li>
</ul>
