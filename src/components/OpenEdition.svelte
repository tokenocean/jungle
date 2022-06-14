<script>
  export let artwork;
</script>

<div class="toggle mb-6">
  <label for="openedition" class="inline-flex items-center">
    <input
      id="openedition"
      class="form-checkbox h-6 w-6"
      type="checkbox"
      bind:checked={artwork.open_edition}
    />
    <span class="ml-3">Open Edition (Date Duration)</span>
  </label>
</div>
{#if artwork.open_edition}
  <div class="openedition-container">
    <div class="flex auction justify-between flex-wrap">
      <div class="flex flex-col">
        <h4 class="mb-4">Open Edition start</h4>
        <div class="flex justify-between">
          <div class="flex flex-col mb-4 mr-6">
            <label for="date">Date</label>
            <input id="date" type="date" name="date" bind:value={start_date} />
          </div>
          <div class="flex flex-col mb-4">
            <label for="time">Time</label>
            <input id="time" type="time" name="time" bind:value={start_time} />
          </div>
        </div>
      </div>
      <div class="flex flex-col">
        <h4 class="mb-4">Open Edition end</h4>
        <div class="flex justify-between">
          <div class="flex flex-col mb-4 mr-6">
            <label for="date">Date</label>
            <input type="date" name="date" bind:value={end_date} />
          </div>
          <div class="flex flex-col mb-4">
            <label for="time">Time</label>
            <input type="time" name="time" bind:value={end_time} />
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
