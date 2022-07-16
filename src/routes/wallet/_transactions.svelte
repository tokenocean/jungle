<script>
  import { session } from "$app/stores";
  import { onMount, onDestroy } from "svelte";
  import { format, parseISO } from "date-fns";
  import { newapi as api } from "$lib/api";
  import { ToggleSwitch } from "$comp";
  import { bitcoinUnitLocal } from "$lib/store";
  import { label, ticker, val, units, satsFormatted } from "$lib/utils";

  export let asset;
  export let transactions = [];

  let page = 1;
  let getTransactions = async () => {
    let { address, multisig } = $session.user;
    transactions = [
      ...(await api()
        .url(`/${address}/${asset}/transactions/${page}`)
        .get()
        .json()),

      ...(await api()
        .url(`/${multisig}/${asset}/transactions/${page}`)
        .get()
        .json()),
    ].sort((a,b) => parseISO(b.created_at) - parseISO(a.created_at));


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
  {#if transactions.length}
    {#each transactions as { amount, id, confirmed, created_at }}
        <a href={`/tx/${id}`}>
          <div class="w-full mb-4">
            <div class="flex">
              <div class="flex-grow text-sm text-gray-500 my-auto">
                {format(parseISO(created_at), "MMM do, yyyy")}
              </div>
              <div
                   class="my-auto"
                class:pending={!confirmed}
                class:text-secondary={confirmed && amount > 0}
              >
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

<style>
  .pending {
    @apply text-orange-400;
  }
</style>
