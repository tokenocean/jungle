<script>
  import { session } from "$app/stores";
  import { Transaction } from "$comp";
  import { psbt } from "$lib/store";
  import { err, info } from "$lib/utils";
  import { Psbt } from "liquidjs-lib";
  import { requirePassword } from "$lib/auth";
  import { broadcast, requestSignature, sign } from "$lib/wallet";

  let clear = () => {
    base64 = undefined;
    $psbt = undefined;
  };

  let base64;

  let parse = () => {
    try {
      $psbt = Psbt.fromBase64(base64);
    } catch(e) {
      err(e);
      $psbt = undefined;
    } 
  };

  let signTx = async () => {
    await requirePassword($session.jwt);
    $psbt = await sign();
    try {
      $psbt = await requestSignature(p);
    } catch (e) {
      console.log(`Couldn't get server signature: ${e.message}`);
    }
    info("Signed");
  };

  let broadcastTx = async () => {
    try {
      await broadcast(true);
    } catch (e) {
      err(e);
    }
  };
</script>

<div class="container mx-auto px-10 mt-16 max-w-4xl">

  {#if $psbt}
    <div class="flex">
      <button on:click={clear} class="secondary-btn mr-2">Clear</button>
      <button on:click={signTx} class="secondary-btn mr-2">Sign</button>
      <button on:click={broadcastTx} class="secondary-btn">Broadcast</button>
    </div>

    <Transaction psbt={$psbt} />
  {:else}
    <textarea bind:value={base64} class="w-full" rows={14} />
    <div class="flex">
      <button on:click={parse} class="secondary-btn mr-2">Parse</button>
    </div>
  {/if}

</div>
