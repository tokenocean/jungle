<script>
  import { prefetch } from "$app/navigation";
  import Fa from "svelte-fa";
  import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
  import { border, bg } from "../_colors";
  import { browser } from "$app/env";
  import { newapi as api, query } from "$lib/api";
  import { onDestroy, onMount, tick } from "svelte";
  import {
    assetCount,
    confirmed,
    unconfirmed,
    password,
    bitcoinUnitLocal,
    user,
    transactions,
    txCount,
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

  import Fund from "../_fund.svelte";
  import Withdraw from "../_withdraw.svelte";
  import Transactions from "../_transactions.svelte";

  export let asset, page;

  let a = asset.asset;
  let balance, pending, funding, withdrawing;

  let toggleFunding = () => {
    funding = !funding;
    withdrawing = false;
  };

  let toggleWithdrawing = () => {
    withdrawing = !withdrawing;
    funding = false;
  };

  let timeout;
  let poll = async () => {
    try {
      clearTimeout(timeout);

      let { username } = $user;
      if (!username) return;

      await getBalance(a);

      balance = val(a, $confirmed[a] || 0);
      pending = val(a, $unconfirmed[a] || 0);

      let { count } = await api()
        .url(`/${username}/${a}/transactions/count`)
        .get()
        .json();

      $txCount = count;

      $transactions = {
        ...$transactions,
        [page]: await api()
          .url(`/${username}/${a}/transactions/${page}`)
          .get()
          .json(),
      };
    } catch (e) {
      console.log("problem fetching balances", e);
    }

    timeout = setTimeout(poll, 5000);
  };

  let init = async () => {
    if (browser) {
      prefetch("/wallet/assets/1");
      if ($confirmed[a]) {
        balance = val(a, $confirmed[a] || 0);
        pending = val(a, $unconfirmed[a] || 0);
      }

      $assetCount = await api().url(`/assets/count`).get().json();
      clearTimeout(timeout);
      poll();
    }
  };

  $: init(a);
  onDestroy(() => clearTimeout(timeout));

  $: labelCalculated =
    label(asset) === "L-BTC" && $bitcoinUnitLocal === "sats"
      ? "L-sats"
      : label(asset);

  $: balanceCalculated =
    label(asset) === "L-BTC" && $bitcoinUnitLocal === "sats"
      ? satsFormatted(balance * 100000000)
      : balance;

  $: pendingCalculated =
    label(asset) === "L-BTC" && $bitcoinUnitLocal === "sats"
      ? satsFormatted(pending * 100000000)
      : pending;
</script>

{#if !isNaN(balance)}
  <div class="w-full">
    {#if $assetCount > 1}
      <div class="mb-5">
        <a class="secondary-color" href="/wallet/assets/1" sveltekit:prefetch>
          <div class="flex">
            <div class="px-5 md:px-0">
              {$assetCount} assets available in this wallet
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
        {label(asset, "name")}
      </div>

      <div class="m-6">
        <div class="text-sm light-color">Balance</div>
          <div
             class:cursor-pointer={label(asset) === 'L-BTC'}
            class="flex mt-3"
            on:click={() =>
              updateBitcoinUnit($bitcoinUnitLocal === "sats" ? "btc" : "sats")}
          >
            <span class="text-4xl text-white mr-3">
              {balanceCalculated}
            </span>
            <span class="text-gray-400 mt-auto">
              {labelCalculated}
            </span>
          </div>
      </div>
      {#if parseFloat(pending) > 0}
        <div class="m-6">
          <div class="text-sm light-color">Pending</div>
          <div class="flex mt-3">
            <span class="mr-3 text-orange-500">
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
      <Transactions {asset} {page} />
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
