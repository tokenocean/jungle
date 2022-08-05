<script>
  import Fa from "svelte-fa";
  import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
  import { Transaction } from "$comp";
  import { Transaction as T, Psbt } from "liquidjs-lib";

  export let hex;

  let tx = T.fromHex(hex);
</script>

<div class="container mx-auto px-10 mt-16 max-w-4xl">
  <div class="mb-5">
    <a
      on:click|preventDefault={() => window.history.back()}
      href="/"
      class="text-midblue"
    >
      <div class="flex">
        <Fa icon={faChevronLeft} class="my-auto mr-1" />
        <div>Back</div>
      </div>
    </a>
    <h3 class="py-4">Transaction details</h3>
  </div>
  <Transaction {tx} />
</div>
