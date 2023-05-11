<script>
  import { user } from "$lib/store";
  import { page } from "$app/stores";
  import { copy, focus } from "$lib/utils";
  import { signMessage, verifySignature } from "$lib/wallet";
  import { onMount } from "svelte";

  let { message } = $page.params;

  let signature;
  onMount(async () => {
    signature = (await signMessage(message)).toString("base64");
      console.log(verifySignature(message, signature));
  });
</script>

<div class="container mx-auto sm:justify-between mt-10 md:mt-20 space-y-5">
  <h2 class="mb-4">Signed Message</h2>
  <div>
    <div><b>Message</b></div>
    <div>{message}</div>
  </div>
  <div>
    <div><b>Address</b></div>
    <div class="break-all">{$user.address}</div>
  </div>
  <button class="primary-btn" on:click={() => copy($user.address)}
    >Copy Address</button
  >
  <div>
    <div><b>Signature</b></div>
    <div class="break-all">{signature}</div>
  </div>
  <button class="primary-btn" on:click={() => copy(signature)}
    >Copy Signature</button
  >
</div>
