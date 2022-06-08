<script>
  import { createMessage } from "$queries/messages";
  import { query } from "$lib/api";
  import { messageUser, prompt } from "$lib/store";
  import { info, err } from "$lib/utils";
  let sendMessage;
  export async function submit() {
    try {
      await query(createMessage, {
        message: {
          message: sendMessage,
          to: $messageUser.id,
        },
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
    class="rounded-lg w-full bg-primary/25"
  />
</form>
