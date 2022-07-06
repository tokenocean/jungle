<script>
  import { session } from "$app/stores";
  import { onMount, onDestroy } from "svelte";
  import { format, parseISO } from "date-fns";
  import { newapi as api } from "$lib/api";
  import { ToggleSwitch } from "$comp";
  import { asset, assets, user } from "$lib/store";
  import { label, ticker, val, units, satsFormatted } from "$lib/utils";

  export let transactions;

  let show = true;

  $: txns = transactions.filter(
    (t) => t.type === "withdrawal" || t.type === "deposit"
  );

  $: $assets = txns
    .map(({ asset, label }) => ({ name: label || ticker(asset), asset }))
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((a, i, r) => a && (!i || a.asset != r[i - 1].asset))
    .sort((a, b) => (a.name === "L-BTC" ? -1 : 1));

  let getTransactions = async () => {
    transactions = await api().url("/transactions").get().json();
  };

  let poll;
  let pollTransactions = async () => {
    await getTransactions();
    poll = setTimeout(pollTransactions, 5000);
  };

  onMount(pollTransactions);
  onDestroy(() => clearTimeout(poll));
</script>

<div class="px-5 sm:px-0">
  {#if txns.length}
    <div class="my-7 flex justify-center">
      <div class="my-auto mr-2">Show all</div>
      <ToggleSwitch
        id="toggle"
        checked={show}
        label={`Show only ${ticker($asset.asset)}`}
        on:change={(e) => {
          show = !show;
        }}
      />
    </div>

    {#each txns as { amount, asset: a, created_at, confirmed, id, label: name }}
      {#if amount && (!show || a === $asset.asset)}
        <a href={`/tx/${id}`}>
          <div class="w-full mb-4">
            <div class="flex">
              <div class="flex-grow text-sm text-gray-500">
                {format(parseISO(created_at), "MMM do, yyyy")}
              </div>
              <div
                class:pending={!confirmed}
                class:text-secondary={confirmed && amount > 0}
              >
                {amount > 0 ? "+" : amount < 0 ? "-" : ""}{label({
                  asset: a,
                  name,
                }) === "L-BTC" &&
                $user &&
                $user.bitcoin_unit === "sats"
                  ? satsFormatted(val(a, Math.abs(amount)) * 100000000)
                  : val(a, Math.abs(amount))}
              </div>
            </div>
            <div class="">
              {label({ asset: a, name }) === "L-BTC" &&
              $user &&
              $user.bitcoin_unit === "sats"
                ? "sats"
                : label({ asset: a, name })}
            </div>
          </div>
        </a>
      {/if}
    {/each}
  {/if}
</div>

<style>
  .pending {
    @apply text-orange-400;
  }
</style>
