<script>
  import { copy, focus } from "$lib/utils";
  import { signMessage, verifySignature } from "$lib/wallet";

  let message;

  let signature;
  let submit = async () => {
    signature = (await signMessage(message)).toString("base64");
  };
</script>

<div class="container mx-auto sm:justify-between mt-10 md:mt-20">
  <h2 class="mb-4">Sign Message</h2>
  {#if signature}
    <div>Signature:</div>
    <div class="mb-4">
      {signature}
    </div>
    <button type="submit" class="primary-btn" on:click={() => copy(signature)}
      >Copy</button
    >
  {:else}
    <form on:submit|preventDefault={submit}>
      <input
        use:focus
        type="text"
        class="w-full rounded-lg p-3 mb-5"
        placeholder="Message"
        bind:value={message}
      />
      <button type="submit" class="primary-btn">Submit</button>
    </form>
  {/if}
</div>