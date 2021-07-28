<script lang="ts">
  /**
   * TODO: User agent will be reduced soon
   * https://blog.chromium.org/2021/05/update-on-user-agent-string-reduction.html
   * @reference https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
   */
  import { locale } from 'svelte-i18n'
  import {
    appName,
    buildVersion,
    repoUrl,
    licenseUrl,
    privacyPolicyUrl,
    attributions,
  } from 'src/utils/env'
  import A from 'src/components/anchor/anchor.svelte'
  import Icon from 'src/icons/icon.svg'

  export let headerId: string

  const thStyle = 'min-width:80px;'
  const thClassName =
    'text-gray-500 font-light text-left min-w-min pr-1 align-top dark:text-gray-300'
</script>

<h1 id={headerId} class="text-lg font-semibold mb-6 capitalize">
  About {appName}
</h1>

<img class="w-10 my-6" src={Icon} alt={appName} />

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

<hr class="my-6" />

<h2 class="font-medium text-left mb-2">Attribution</h2>

<ul class="font-light mb-2">
  {#each attributions as { projectUrl, projectName, licenseType, licenseUrl, authors } (projectUrl)}
    <li>
      <A href={projectUrl} newTab>{projectName}</A> by {authors} - <A
        href={licenseUrl}
        newTab>{licenseType}</A
      >
    </li>
  {/each}
</ul>

<p class="font-light">
  For additional attribution, please see this <A href={repoUrl} newTab
    >project's source</A
  >.
</p>
