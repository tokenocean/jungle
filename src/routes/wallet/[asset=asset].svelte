<script context="module">
  export async function load({ params }) {
    return {
      props: {
        a: params.asset,
      },
    };
  }
</script>

<script>
  import { prefetch } from "$app/navigation";
  import Fa from "svelte-fa";
  import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
  import { border, bg } from "./_colors";
  import { browser } from "$app/env";
  import { newapi as api, query } from "$lib/api";
  import { onDestroy, onMount, tick } from "svelte";
  import {
    asset,
    count,
    confirmed,
    unconfirmed,
    password,
    bitcoinUnitLocal,
  } from "$lib/store";
  import { ProgressLinear } from "$comp";
  import { getArtworksByOwner } from "$queries/artworks";
  import {
    btc,
    err,
    label,
    sats,
    val,
    satsFormatted,
    updateBitcoinUnit,
  } from "$lib/utils";
  import { requireLogin } from "$lib/auth";
  import { getBalance } from "$lib/wallet";

  import Fund from "./_fund.svelte";
  import Withdraw from "./_withdraw.svelte";
  import Transactions from "./_transactions.svelte";

  export let a;

  let balance, pending, funding, withdrawing;

  let toggleFunding = () => {
    funding = !funding;
    withdrawing = false;
  };

  let toggleWithdrawing = () => {
    withdrawing = !withdrawing;
    funding = false;
  };

  let poll;
  let pollBalances = async () => {
    await getBalance(a);

    balance = val(a, $confirmed[a] || 0);
    pending = val(a, $unconfirmed[a] || 0);

    poll = setTimeout(pollBalances, 5000);
  };

  let init = async () => {
    browser && prefetch("/wallet/assets/1");
    if ($confirmed[a]) {
      balance = val(a, $confirmed[a] || 0);
      pending = val(a, $unconfirmed[a] || 0);
    }

    $count = await api().url(`/assets/count`).get().json();
    $asset = await api().url(`/asset/${a}`).get().json();

    pollBalances();
  };

  onMount(init);
  onDestroy(() => clearTimeout(poll));

  $: labelCalculated =
    label($asset) === "L-BTC" && $bitcoinUnitLocal === "sats"
      ? "L-sats"
      : label(asset);

  $: balanceCalculated =
    label($asset) === "L-BTC" && $bitcoinUnitLocal === "sats"
      ? satsFormatted(balance * 100000000)
      : balance;

  $: pendingCalculated =
    label($asset) === "L-BTC" && $bitcoinUnitLocal === "sats"
      ? satsFormatted(pending * 100000000)
      : pending;
</script>

{#if balance}
  <div class="w-full">
    {#if $count > 1}
      <div class="mb-5">
        <a class="secondary-color" href="/wallet/assets/1">
          <div class="flex">
            <div class="px-5 md:px-0">
              {$count} assets available in this wallet
            </div>
            <div class="my-auto ml-1">
              <Fa icon={faChevronRight} />
            </div>
          </div>
        </a>
      </div>
    {/if}

    <div class="dark-bg mb-2 pt-1 sm:rounded-lg">
      <div
        class={`border-l-8 text-center p-3 text-white text-xl w-1/2 rounded-r-full mt-5 font-bold ${border(
          a
        )} ${bg(a)}`}
      >
        {label($asset, "name")}
      </div>

      <div class="m-6">
        <div class="text-sm light-color">Balance</div>
        <button
          class="flex mt-3"
          on:click={() =>
            updateBitcoinUnit($bitcoinUnitLocal === "sats" ? "btc" : "sats")}
          disabled={label($asset) !== "L-BTC"}
        >
          <span class="text-4xl text-white mr-3">
            {balanceCalculated}
          </span>
          <span class="text-gray-400 mt-auto">
            {labelCalculated}
          </span>
        </button>
      </div>
      {#if pending && val(a, pending)}
        <div class="m-6">
          <div class="text-sm light-color">Pending</div>
          <div class="flex mt-3">
            <span class="light-color mr-3">
              {pendingCalculated}
            </span>
            <span class="text-gray-400"> {labelCalculated}</span>
          </div>
        </div>
      {/if}
      <div class="flex justify-between p-6 pt-2">
        <button on:click={toggleFunding} class="button-trans-gray w-full mr-2"
          >Fund</button
        >
        <button
          on:click={toggleWithdrawing}
          class="button-trans-gray w-full ml-2"
          disabled={!balance}>Withdraw</button
        >
      </div>
    </div>
    <div>
      <Fund bind:funding asset={a} />
      <Withdraw bind:withdrawing asset={a} />
      <Transactions asset={a} />
    </div>
  </div>
{/if}

<style>
  .dark-red {
    background: #2b0208;
  }
  .dark-green {
    background: #082527;
  }
  .dark-gray {
    background: #31373e;
  }
  .border-blue {
    border-color: #6ed8e0;
  }

  .bg-btc {
    background: rgba(52, 190, 171, 0.25);
  }
  .border-btc {
    border-color: #30bfad;
  }

  .light-color {
    color: #f4f4f4;
  }

  .active {
    @apply border-t-2 border-b-2 border-r-2 text-white;
  }

  button:disabled {
    @apply text-gray-400 border-gray-400;
  }
</style>
