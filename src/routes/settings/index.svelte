<script>
  import { updateBitcoinUnit, updateFiats, info } from "$lib/utils";
  import { bitcoinUnitLocal, fiatRates, user } from "$lib/store";
  import Fa from "svelte-fa";
  import { faLifeRing, faTimes } from "@fortawesome/free-solid-svg-icons";

  const fiatOptions = Object.keys($fiatRates);
  $: selectedFiats = ($user?.fiats && JSON.parse($user.fiats)) || [];
</script>

<div class="py-10">
  <h2 class="text-center mb-10">Settings</h2>
  <div class="flex justify-center items-center">
    <div class="space-y-10 w-full md:w-[300px]">
      <div class="flex justify-between items-center">
        <label for="bitcoin-units" class="text-xl font-semibold mr-5"
          >Bitcoin Unit:</label
        >
        <select
          name="bitcoin-units"
          id="bitcoin-units"
          class="rounded-lg border border-primary"
          on:change={(e) => {
            updateBitcoinUnit(e.target.value);
            info("Bitcoin unit set");
          }}
        >
          <option value="btc" selected={$bitcoinUnitLocal === "btc"}>BTC</option
          >
          <option value="sats" selected={$bitcoinUnitLocal === "sats"}
            >sats</option
          >
        </select>
      </div>

      <a
        href="/wallet/setup"
        class="flex justify-between items-center text-xl font-semibold"
      >
        Wallet Recovery
        <Fa icon={faLifeRing} />
      </a>

      <div>
        <div class="flex justify-between items-center">
          <label for="bitcoin-units" class="text-xl font-semibold mr-5"
            >Fiat Currencies:</label
          >
          <select
            name="fiats"
            id="fiats"
            class="rounded-lg border border-primary"
            on:change={(e) => {
              if (!$user.fiats.includes(e.target.value)) {
                updateFiats(e.target.value, "add");
              }
            }}
          >
            {#each fiatOptions as fiat}
              <option value={fiat}>{fiat}</option>
            {/each}
          </select>
        </div>
        <div class="flex flex-wrap mt-5">
          {#each selectedFiats as fiat}
            <div class="m-1 primary-btn flex justify-between items-center">
              {fiat}
              <button
                class="ml-2 text-black"
                on:click={() => updateFiats(fiat, "remove")}
                ><Fa icon={faTimes} /></button
              >
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
