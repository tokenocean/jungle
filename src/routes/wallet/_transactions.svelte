<script>
  import { onMount, onDestroy } from "svelte";
  import { format, parseISO } from "date-fns";
  import { newapi as api } from "$lib/api";
  import { ToggleSwitch } from "$comp";
  import { bitcoinUnitLocal, transactions, txCount } from "$lib/store";
  import { label, ticker, val, units, satsFormatted } from "$lib/utils";

  export let asset, page;

  let a = asset.asset;
  let offset = 25;
  $: pages = new Array(Math.ceil($txCount / offset));
</script>

<div class="px-5 sm:px-0 mt-8">
  {#if $transactions[page]?.length}
    {#each $transactions[page] as { amount, hash, confirmed, created_at }}
      <a href={`/tx/${hash}`}>
        <div class="w-full mb-4">
          <div class="flex">
            <div class="flex-grow text-sm text-gray-500 my-auto">
              {format(parseISO(created_at), "MMM do, yyyy")}
            </div>
            <div
              class="my-auto"
              class:text-secondary={amount > 0}
              class:text-orange-500={!confirmed}
            >
              {amount > 0 ? "+" : amount < 0 ? "-" : ""}{label(asset) ===
                "L-BTC" && $bitcoinUnitLocal === "sats"
                ? satsFormatted(val(a, Math.abs(amount)) * 100000000)
                : val(a, Math.abs(amount))}
            </div>
          </div>
        </div>
      </a>
    {/each}
  {/if}
</div>

{#if pages.length > 1}
  <div class="full-width flex bg-white p-4 mx-auto">
    <div class="mx-auto">
      {#each pages as _, i}
        <a href={`/wallet/${a}/${i + 1}`}>
          <button
            class="rounded-full w-12 h-12"
            class:font-bold={i + 1 === page}>{i + 1}</button
          >
        </a>
      {/each}
    </div>
  </div>
{/if}
