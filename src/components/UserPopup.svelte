<script>
  import { SendMessage, SendTip } from "$comp";
  import { goto } from "$lib/utils";
  import {
    messageUser,
    prompt,
    tipUser,
    user as currentuser,
  } from "$lib/store";
  import Fa from "svelte-fa";
  import {
    faWallet,
    faUserCircle,
    faEnvelopeOpen,
  } from "@fortawesome/free-solid-svg-icons";

  export let showPopup, popperContent, user;

  const extraOpts = {
    modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
  };
</script>

<div
  id="tooltip"
  use:popperContent={extraOpts}
  class="bg-primary p-4 rounded-lg border border-black/25 shadow-lg z"
>
  <div class="space-y-2">
    <button
      class="bg-white"
      on:click={() => {
        showPopup = false;
        goto(`/${user.username}`);
      }}
    >
      <Fa icon={faUserCircle} class="mx-2" /> Profile
    </button>
    <button
      class="bg-white"
      on:click={(e) => {
        e.preventDefault();
        showPopup = false;
        if (!$currentuser) {
          goto("/login");
        } else {
          $messageUser = user;
          prompt.set(SendMessage);
        }
      }}
    >
      <Fa icon={faEnvelopeOpen} class="mx-2" /> Message</button
    >
    <button
      class="bg-white"
      on:click={(e) => {
        e.preventDefault();
        showPopup = false;
        if (!$currentuser) {
          goto("/login");
        } else {
          $tipUser = { username: user.username, address: user.address };
          prompt.set(SendTip);
        }
      }}><Fa icon={faWallet} class="mx-2" /> Tip</button
    >
  </div>
  <div id="arrow" data-popper-arrow />
</div>

<style>
  button {
    @apply bg-white text-black block font-medium border border-black/25 rounded-full px-2 py-1 flex items-center w-32;
  }

  .z {
    z-index: 100;
  }
</style>
