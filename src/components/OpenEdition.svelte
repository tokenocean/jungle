<script>
  import { isValid, parse } from "date-fns";

  export let artwork;

  let start_date, start_time, end_date, end_time;

  $: updateDates(start_date, start_time, end_date, end_time);
  let updateDates = () => {
    artwork.open_edition_start = parse(
      `${start_date} ${start_time}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );

    artwork.open_edition_end = parse(
      `${end_date} ${end_time}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );

    if (!isValid(artwork.open_edition_start)) artwork.auction_start = undefined;
    if (!isValid(artwork.open_edition_end)) artwork.auction_end = undefined;
  };
</script>

<div class="toggle mb-6">
  <label for="openedition" class="inline-flex items-center">
    <input
      id="openedition"
      class="form-checkbox h-6 w-6"
      type="checkbox"
      bind:checked={artwork.open_edition}
    />
    <span class="ml-3">Open Edition</span>
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

<style>
  input[type="checkbox"]:checked {
    appearance: none;
    border: 5px solid #fff;
    outline: 2px solid #6ed8e0;
    background-color: #6ed8e0;
    padding: 2px;
    border-radius: 0;
  }
</style>
