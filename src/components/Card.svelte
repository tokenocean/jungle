<script>
  import { Avatar, ArtworkMedia, Heart } from "$comp";
  import countdown from "$lib/countdown";
  import { fade, units, satsFormatted, updateBitcoinUnit } from "$lib/utils";
  import { onDestroy, onMount } from "svelte";
  import { loaded, bitcoinUnitLocal } from "$lib/store";
  import { session } from "$app/stores";

  export let justScrolled = false;
  export let artwork;
  export let columns = 3;
  export let showDetails = true;
  export let thumb = true;
  export let popup = false;
  export let height = undefined;
  export let noAudio = false;

  $: style = height ? `height: ${height}px` : undefined;

  let sats, val, ticker;
  $: if (artwork) [sats, val, ticker] = units(artwork.asking_asset);

  let width = "full";
  if (columns > 1) {
    width = "1/" + columns;
  }

  let start_counter, end_counter;
  let timeout;
  let auction_underway;
  let count = () => {
    if (!artwork) return;
    start_counter = countdown(new Date(artwork.auction_start));
    end_counter = countdown(new Date(artwork.auction_end));
    timeout = setTimeout(count, 1000);

    let now = new Date();
    auction_underway =
      now > new Date(artwork.auction_start) &&
      now < new Date(artwork.auction_end);
  };

  onMount(count);
  onDestroy(() => clearTimeout(timeout));

  let bitcoinUnit;
  $: tickerCalculated =
    ticker === "L-BTC" && $bitcoinUnitLocal === "sats" ? "sats" : ticker;

  $: listPrice =
    ticker === "L-BTC" && $bitcoinUnitLocal === "sats"
      ? satsFormatted(artwork.list_price)
      : val(artwork.list_price);

  $: currentBid =
    ticker === "L-BTC" && $bitcoinUnitLocal === "sats"
      ? satsFormatted(artwork.bid && artwork.bid.amount)
      : val(artwork.bid && artwork.bid.amount);
</script>

<div
  class="{showDetails ? 'card' : ''} flex {!showDetails || $loaded[artwork.id]
    ? 'bg-white'
    : 'bg-gray-100'} flex-col justify-between h-full"
  in:fade
>
  <div {style}>
    <a href={`/a/${artwork.slug}`} sveltekit:prefetch>
      {#if $loaded[artwork.id] || !justScrolled}
        <ArtworkMedia {noAudio} {artwork} {showDetails} {popup} bind:thumb />
      {/if}
    </a>
  </div>
  {#if showDetails}
    <div class="bg-white mb-auto">
      <div class="p-4">
        <div class="flex flex-row justify-between h-20">
          <a href={`/a/${artwork.slug}`} class="mr-2">
            <h1 class="text-xl break-all overflow-y-hidden max-h-14">
              {artwork.title || "Untitled"}
              {#if !(artwork.transferred_at || artwork.asking_asset)}
                (unlisted)
              {/if}
            </h1>
            {#if artwork.editions > 1}
              <h2 class="text-xs text-gray-400 font-light mb-auto">
                Edition
                {artwork.edition}
                of
                {artwork.editions}
              </h2>
            {/if}
          </a>
          <Heart {artwork} />
        </div>
        <div class="flex mb-4">
          <div class="1/2 flex-1">
            <button
              class="price"
              on:click={() => {
                updateBitcoinUnit(
                  bitcoinUnit.innerHTML === "sats" ? "btc" : "sats"
                );
              }}
              disabled={ticker !== "L-BTC"}
            >
              {#if artwork.list_price}
                {listPrice}
              {:else}&mdash;{/if}
              <span bind:this={bitcoinUnit}> {tickerCalculated}</span>
            </button>
            <div class="w-1/2 text-xs font-medium">List Price</div>
          </div>
          {#if artwork.bid && artwork.bid.user}
            <div class="1/2 flex-1">
              <div class="price">
                {currentBid}
                {tickerCalculated}
              </div>
              <div class="text-xs font-medium">
                Current bid by
                <a
                  href={`/${artwork.bid.user.username}`}
                  class="secondary-color">@{artwork.bid.user.username}</a
                >
              </div>
            </div>
          {/if}
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="text-sm">
            <a
              href={`/${artwork.artist.username}`}
              on:click={(e) => {
                if (
                  !$session.user ||
                  (artwork &&
                    $session.user.username !== artwork.artist.username)
                ) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <div class="flex">
                <Avatar user={artwork.artist} size="xs" />
                <div class="mx-1 w-3/4">
                  <div class="truncate">@{artwork.artist.username}</div>
                  <div class="text-xs text-gray-600">Artist</div>
                </div>
              </div>
            </a>
          </div>

          {#if artwork.owner.id !== artwork.artist.id}
            <div class="text-sm">
              <a
                href={`/${artwork.owner.username}`}
                on:click={(e) => {
                  if (
                    !$session.user ||
                    (artwork &&
                      $session.user.username !== artwork.owner.username)
                  ) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                <div class="flex">
                  <Avatar user={artwork.owner} size="xs" />
                  <div class="ml-2 w-3/4">
                    <div class="truncate">@{artwork.owner.username}</div>
                    <div class="text-xs text-gray-600">Owner</div>
                  </div>
                </div>
              </a>
            </div>
          {/if}
        </div>
      </div>
    </div>
    {#if auction_underway}
      <div class="p-3 rounded-b-lg lightblue-grad text-black mt-auto">
        Time left:
        {end_counter}
      </div>
    {:else if start_counter}
      <div class="p-3 rounded-b-lg lightblue-grad text-black mt-auto">
        Starts in:
        {start_counter}
      </div>
    {:else}
      <div class="p-3 rounded-b-lg">&nbsp;</div>
    {/if}
  {/if}
</div>

<style>
  .card {
    border-radius: 10px;
    @apply shadow-md;
  }

  .card :global(img),
  .card :global(video) {
    border-radius: 10px 10px 0 0;
  }

  .price {
    font-size: 15px;
  }
</style>
