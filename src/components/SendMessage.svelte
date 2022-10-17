<script>
  import { createMessage } from "$queries/messages";
  import { api, query } from "$lib/api";
  import { messageUser, prompt, token } from "$lib/store";
  import { info, err, encrypt } from "$lib/utils";
  import { keypair } from "$lib/wallet";
  import { requirePassword } from "$lib/auth";
  import { onMount } from "svelte";
  let sendMessage;

  let ownPrivKey;
  let ownPubKey;
  onMount(async () => {
    await requirePassword();
    ownPrivKey = keypair().privkey.toString("hex");
    ownPubKey = keypair().pubkey.toString("hex").substring(2);
  });

  export async function submit() {
    try {
      let encryptedMessage = encrypt(
        ownPrivKey,
        $messageUser.pubkey,
        sendMessage
      );

      await query(createMessage, {
        message: {
          message: encryptedMessage,
          to: $messageUser.id,
        },
      });

      await api.url("/mail-message-received").auth(`Bearer ${$token}`).post({
        userId: $messageUser.id,
      });

      $prompt = undefined;
      sendMessage = "";
      info("Message sent!");
    } catch (e) {
      if (e.message.includes("null")) {
        err("Message cannot be empty.");
      }
      err(e);
    }
  }
</script>

<h1 class="mb-5 text-4xl">Message {$messageUser.username}</h1>
<form on:submit|preventDefault={submit}>
  <textarea
    bind:value={sendMessage}
    required
    placeholder="Enter message..."
    id="message"
    name="message"
    class="rounded-lg w-full"
  />
</form>
