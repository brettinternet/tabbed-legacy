<!-- https://tailwindcomponents.com/component/toggle-switch -->

<div
  class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
>
  <input
    type="checkbox"
    name="toggle"
    id="toggle"
    class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
  />
  <label
    for="toggle"
    class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
  />
</div>
<label for="toggle" class="text-xs text-gray-700">Toggle me.</label>

<style>
  .toggle-checkbox:checked {
    @apply right-0 border-green-400;
    right: 0;
    border-color: #68d391;
  }
  .toggle-checkbox:checked + .toggle-label {
    @apply bg-green-400;
    background-color: #68d391;
  }
</style>
