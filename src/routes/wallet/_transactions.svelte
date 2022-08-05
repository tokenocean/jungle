<script>
  import { session } from "$app/stores";
  import { onMount, onDestroy } from "svelte";
  import { format, parseISO } from "date-fns";
  import { newapi as api } from "$lib/api";
  import { ToggleSwitch } from "$comp";
  import { bitcoinUnitLocal, transactions } from "$lib/store";
  import { label, ticker, val, units, satsFormatted } from "$lib/utils";

  export let asset, page;

  let offset = 25;
  let count = 200;
  let pages = new Array(Math.ceil(count / offset));

  let getTransactions = async () => {
    let { username } = $session.user;
    try {
    $transactions = await api()
      .url(`/${username}/${asset}/transactions/${page}`)
      .get()
      .json();
    } catch(e) {
      console.log("problem fetching transactions", e);
    } 
  };

  let timeout;
  let poll = async () => {
    await getTransactions();
    timeout = setTimeout(poll, 5000);
  };

  onMount(poll);
  onDestroy(() => clearTimeout(timeout));
</script>

<div class="px-5 sm:px-0 mt-8">
  {#if $transactions.length}
    {#each $transactions as { amount, hash, confirmed, created_at }}
      <a href={`/tx/${hash}`}>
        <div class="w-full mb-4">
          <div class="flex">
            <div class="flex-grow text-sm text-gray-500 my-auto">
              {format(parseISO(created_at), "MMM do, yyyy")}
            </div>
            <div class="my-auto" class:text-secondary={amount > 0}>
              {amount > 0 ? "+" : amount < 0 ? "-" : ""}{label({
                asset,
                name,
              }) === "L-BTC" && $bitcoinUnitLocal === "sats"
                ? satsFormatted(val(asset, Math.abs(amount)) * 100000000)
                : val(asset, Math.abs(amount))}
            </div>
          </div>
        </div>
      </a>
    {/each}
  {/if}
</div>

<div class="full-width flex bg-white p-4 mx-auto">
  <div class="mx-auto">
    {#each pages as _, i}
      <a href={`/wallet/${asset}/${i + 1}`}>
        <button class="rounded-full w-12 h-12" class:font-bold={i + 1 === page}
          >{i + 1}</button
        >
      </a>
    {/each}
  </div>
</div>
