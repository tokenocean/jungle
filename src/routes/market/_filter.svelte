<script>
  import { onMount } from "svelte";
  import Select from "svelte-select"
  import { ToggleSwitch } from "$comp";
  import { filterCriteria as fc } from "$lib/store";

  const currencies = ['L-BTC', 'Tether'];

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
        label="Has Open Auction"
        checked={$fc.hasOpenAuction}
          on:change={(e) => ($fc.hasOpenAuction = e.target.checked)}
      />
    </div>
    <div>
      <ToggleSwitch
        id="currency"
        label="Currency is"
        checked={$fc.filterByCurrency}
        on:change={(e) => ($fc.filterByCurrency = e.target.checked)}
      />
      <select value={$fc.selectedCurrency} on:change="{() => answer = ''}">
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
</style>
