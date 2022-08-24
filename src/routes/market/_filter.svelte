<script>
  import { onMount } from "svelte";
  import Select from "svelte-select";
  import { ToggleSwitch } from "$comp";
  import { filterCriteria as fc } from "$lib/store";
  import { btc, usd, cad } from "$lib/utils";

  const currencies = ["L-BTC", "L-USDT", "L-CAD"];

  export let showFilters;
</script>

<div class:showFilters class="hidden w-full space-y-4">
  <div class="grid-container">
    <div>
      <ToggleSwitch
        id="list-price"
        label="Has list price"
        checked={$fc.listPrice}
        on:change={(e) => ($fc.listPrice = e.target.checked)}
      />
    </div>
    <div>
      <ToggleSwitch
        id="open-bid"
        label="Has open bid"
        checked={$fc.openBid}
        on:change={(e) => ($fc.openBid = e.target.checked)}
      />
    </div>
    <div>
      <ToggleSwitch
        id="owned-by-creator"
        label="Owned by creator"
        checked={$fc.ownedByCreator}
        on:change={(e) => ($fc.ownedByCreator = e.target.checked)}
      />
    </div>
    <div>
      <ToggleSwitch
        id="has-sold"
        label="Has sold"
        checked={$fc.hasSold}
        on:change={(e) => ($fc.hasSold = e.target.checked)}
      />
    </div>
    <div>
      <ToggleSwitch
        id="is-physical"
        label="Physical artwork"
        checked={$fc.isPhysical}
        on:change={(e) => ($fc.isPhysical = e.target.checked)}
      />
    </div>
    <div>
      <ToggleSwitch
        id="has-royalties"
        label="Has royalties"
        checked={$fc.hasRoyalties}
        on:change={(e) => ($fc.hasRoyalties = e.target.checked)}
      />
    </div>
    <div>
      <ToggleSwitch
        id="is-favorited"
        label="Is favorited"
        checked={$fc.isFavorited}
        on:change={(e) => ($fc.isFavorited = e.target.checked)}
      />
    </div>
    <div>
      <ToggleSwitch
        id="from-followed"
        label="From followed"
        checked={$fc.fromFollowed}
        on:change={(e) => ($fc.fromFollowed = e.target.checked)}
      />
    </div>
    <div>
      <ToggleSwitch
        id="has-open-auction"
        label="Has open auction"
        checked={$fc.hasOpenAuction}
        on:change={(e) => ($fc.hasOpenAuction = e.target.checked)}
      />
    </div>
  </div>
  <div class="flex flex-nowrap">
    <ToggleSwitch
       id="currency"
       label="Listing currency"
       checked={$fc.filterByCurrency}
       on:change={(e) => ($fc.filterByCurrency = e.target.checked)}
       />
       <div class="my-auto ml-2">
    <select
      bind:value={$fc.selectedCurrency}
      class="rounded-full appearance-none bg-gray-100"
    >
      {#each currencies as currency}
        <option value={currency}>
          {currency}
        </option>
      {/each}
    </select>
    </div>
  </div>
</div>

<style>
  .showFilters {
    display: block !important;
    width: 100%;
  }

  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 10px 10px;
    padding-top: 35px;
  }

  select {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAh0lEQVQ4T93TMQrCUAzG8V9x8QziiYSuXdzFC7h4AcELOPQAdXYovZCHEATlgQV5GFTe1ozJlz/kS1IpjKqw3wQBVyy++JI0y1GTe7DCBbMAckeNIQKk/BanALBB+16LtnDELoMcsM/BESDlz2heDR3WePwKSLo5eoxz3z6NNcFD+vu3ij14Aqz/DxGbKB7CAAAAAElFTkSuQmCC");
    background-repeat: no-repeat;
    background-position: 90%;
  }

  select {
    padding: 10px 40px 10px 20px;
    margin-top: -20px;
  }
</style>
