<script>
  import { ticker, val, satsFormatted } from "$lib/utils";
  import { bitcoinUnitLocal, user, fiatRates } from "$lib/store";
  import { Fiat } from "$comp";
  export let transaction;

  $: fiatAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: $user ? $user.fiat : "USD",
    signDisplay: "never",
  }).format(
    transaction.amount * ($fiatRates[$user ? $user.fiat : "USD"] / 100000000)
  );

  $: amount =
    ticker(transaction.asset) === "L-BTC" && $bitcoinUnitLocal === "sats"
      ? satsFormatted(transaction.amount)
      : val(transaction.asset, transaction.amount);

  $: asset =
    ticker(transaction.asset) === "L-BTC" && $bitcoinUnitLocal === "sats"
      ? "L-sats"
      : ticker(transaction.asset);

  $: amountPurchased =
    ticker(transaction.asset) === "L-BTC" && $bitcoinUnitLocal === "sats"
      ? satsFormatted(Math.abs(transaction.amount))
      : val(transaction.asset, Math.abs(transaction.amount));
</script>

{#if transaction}
  <div class:line-through={transaction.type.includes("cancelled")}>
    <a href={`/${transaction.user.username}`} class="secondary-color"
      >@{transaction.user.username}</a
    >
    {#if transaction.type.includes("bid")}
      offered
      {amount}
      {asset}
      {#if ticker(transaction.asset) !== "L-CAD" && ticker(transaction.asset) !== "L-USDt"}
        <span class="text-sm">
          (<Fiat
            style={transaction.type.includes("cancelled") ? "line-through" : ""}
            amount={fiatAmount}
          />)</span
        >
      {/if}
      for
    {:else if transaction.type === "comment"}
      donated
      {amount}
      {asset}
      {#if ticker(transaction.asset) !== "L-CAD" && ticker(transaction.asset) !== "L-USDt"}
        <span class="text-sm">
          (<Fiat
            style={transaction.type.includes("cancelled") ? "line-through" : ""}
            amount={fiatAmount}
          />)</span
        >
      {/if}
      to comment on
    {:else if transaction.type === "receipt"}
      received
    {:else if transaction.type === "transfer"}
      transferred
    {:else if transaction.type === "creation"}
      created
    {:else if transaction.type === "cancel"}
      cancelled the previous listing price of
      {amount}
      {asset}
      {#if ticker(transaction.asset) !== "L-CAD" && ticker(transaction.asset) !== "L-USDt"}
        <span class="text-sm">
          (<Fiat
            style={transaction.type.includes("cancelled") ? "line-through" : ""}
            amount={fiatAmount}
          />)</span
        >
      {/if}
      for
    {:else if transaction.type.includes("listing")}
      set a listing price of
      {amount}
      {asset}
      {#if ticker(transaction.asset) !== "L-CAD" && ticker(transaction.asset) !== "L-USDt"}
        <span class="text-sm">
          (<Fiat
            style={transaction.type.includes("cancelled") ? "line-through" : ""}
            amount={fiatAmount}
          />)</span
        >
      {/if}
      for
    {:else if transaction.type === "return"}
      received no bids for
    {:else if transaction.type === "release"}
      won the auction for
    {:else if transaction.type === "auction"}
      setup an auction for
    {:else if transaction.type === "purchase"}
      paid
      {amountPurchased}

      {asset}
      {#if ticker(transaction.asset) !== "L-CAD" && ticker(transaction.asset) !== "L-USDt"}
        <span class="text-sm">
          (<Fiat
            style={transaction.type.includes("cancelled") ? "line-through" : ""}
            amount={fiatAmount}
          />)</span
        >
      {/if}
      for
    {:else if transaction.type === "accept"}
      accepted
      {amount}
      {asset}
      {#if ticker(transaction.asset) !== "L-CAD" && ticker(transaction.asset) !== "L-USDt"}
        <span class="text-sm">
          (<Fiat
            style={transaction.type.includes("cancelled") ? "line-through" : ""}
            amount={fiatAmount}
          />)</span
        >
      {/if}
      from
      <a href={`/${transaction.bid.user.username}`} class="secondary-color"
        >@{transaction.bid.user.username}</a
      >
      for
    {/if}
    {#if transaction.artwork}
      <a href={`/a/${transaction.artwork.slug}`} class="secondary-color"
        >{transaction.artwork.title || "Untitled"}</a
      >
    {/if}
  </div>
{/if}
