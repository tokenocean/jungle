<script>
  import { updateBitcoinUnit, info } from "$lib/utils";
  import { user } from "$lib/store";
  import Fa from "svelte-fa";
  import { faLifeRing } from "@fortawesome/free-solid-svg-icons";
</script>

<div class="py-10">
  <h2 class="text-center mb-10">Settings</h2>
  <div class="flex justify-center items-center">
    <div>
      <label for="bitcoin-units" class="text-xl font-semibold mr-5"
        >Bitcoin Unit:</label
      >
      <select
        name="bitcoin-units"
        id="bitcoin-units"
        class="rounded-lg border border-primary p-2"
        on:change={(e) => {
          updateBitcoinUnit(e.target.value);
          info("Bitcoin unit set");
        }}
      >
        <option value="btc" selected={$user && $user.bitcoin_unit === "btc"}
          >BTC</option
        >
        <option value="sats" selected={$user && $user.bitcoin_unit === "sats"}
          >sats</option
        >
      </select>

      <a
        href="/wallet/setup"
        class="flex justify-between items-center text-xl font-semibold mt-5"
      >
        Wallet Recovery
        <Fa icon={faLifeRing} />
      </a>
    </div>
  </div>
</div>
