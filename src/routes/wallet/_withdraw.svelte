<script>
  import { query } from "$lib/api";
  import { tick } from "svelte";
  import { user, psbt, bitcoinUnitLocal } from "$lib/store";
  import { broadcast, pay, keypair, requestSignature } from "$lib/wallet";
  import { btc, dev, err, info, sats, val, ticker } from "$lib/utils";
  import sign from "$lib/sign";
  import { ProgressLinear } from "$comp";
  import { requirePassword } from "$lib/auth";
  import { getArtworkByAsset } from "$queries/artworks";

  export let asset;
  export let withdrawing = false;

  let amount;
  let to = dev
    ? "AzppkpkTHBGfGcvU89AKH9JNuoe24LZvjbNCDStpykLLUj2S3n3zPFPVhQCiC8akswapzRrEqHnJUmMQ"
    : "";

  let loading;
  let artwork;

  $: updateAsset(asset);
  let updateAsset = (asset) =>
    asset &&
    query(getArtworkByAsset, { asset })
      .then(({ artworks }) => (artwork = artworks[0]))
      .catch(err);

  $: clearForm(asset);
  let clearForm = () => {
    amount = undefined;
  };

  let send = async (e) => {
    await requirePassword();

    loading = true;
    try {
      if (asset !== btc && !artwork) artwork = { asset };
      $psbt = await pay(artwork, to.trim(), sats(asset, 
asset === btc && $bitcoinUnitLocal === "sats"
            ? amount / 100000000
            : amount
));
      $psbt = await sign();

      if (artwork?.held === "multisig") {
        $psbt = await requestSignature($psbt);
      }

      await broadcast();

      info("Payment sent!");
      withdrawing = false;
    } catch (e) {
      console.log(e);
      err(e);
    }
    loading = false;
  };

  $: unitCalculated = $bitcoinUnitLocal === "sats" ? "L-sats" : "L-BTC";
</script>

{#if $user && withdrawing}
  <form
    class="dark-bg md:rounded-lg p-5 w-full flex flex-col mb-8"
    on:submit|preventDefault={send}
    autocomplete="off"
  >
    {#if loading}
      <ProgressLinear />
    {:else}
      <div class="flex flex-col mb-4">
        <label for="amount">Amount</label>
        <div class="flex relative justify-between text-black">
          <input
            id="amount"
            class="w-full"
            placeholder={val(asset, 0)}
            bind:value={amount}
          />
          {#if ticker(asset) === "L-BTC"}
            <div class="absolute top-[17px] right-2">
              {unitCalculated}
            </div>
          {/if}
        </div>
      </div>
      <div class="flex flex-col mb-4">
        <label for="address">Recipient Address</label>
        <textarea
          id="address"
          style="overflow:auto"
          placeholder="Address"
          bind:value={to}
          rows={4}
        />
      </div>
      <button type="submit" class="primary-btn w-full mt-5"
        >Complete withdraw</button
      >
    {/if}
  </form>
{/if}

<style>
  textarea,
  input {
    @apply rounded-lg p-2 text-black;
    margin-top: 10px;
  }
</style>
