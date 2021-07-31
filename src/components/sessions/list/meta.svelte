<script lang="ts">
  import type { Session } from 'src/utils/browser/storage'

  export let session: Session
</script>

<table class="font-light text-gray-400 dark:text-gray-500">
  <caption class="text-left mb-1">Session:</caption>
  <tbody>
    <tr>
      <th class="pr-2">ID</th>
      <td>{session.id}</td>
    </tr>
  </tbody>
</table>
