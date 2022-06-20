<script>
  export let user = undefined;
  export let src = undefined;
  export let overlay = undefined;
  export let size = "small";
  import { session } from "$app/stores";
  import { messageUser, prompt, tipUser } from "$lib/store";
  import { createPopperActions } from "svelte-popperjs";
  import { SendMessage, SendTip } from "$comp";
  import { goto } from "$lib/utils";
  import Fa from "svelte-fa";
  import {
    faWallet,
    faUserCircle,
    faEnvelopeOpen,
  } from "@fortawesome/free-solid-svg-icons";
  import OutClick from "svelte-outclick";

  const [popperRef, popperContent] = createPopperActions({
    placement: "right",
  });
  const extraOpts = {
    modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
  };

  let showTooltip = false;
</script>

{#if showTooltip}
  <OutClick on:outclick={() => (showTooltip = false)}>
    <div
      id="tooltip"
      use:popperContent={extraOpts}
      class="bg-primary p-4 rounded-lg border border-black/25 shadow-lg z"
    >
      <div class="space-y-2">
        <button
          class="text-black block font-medium border border-black/25 rounded-full px-2 py-1 flex items-center w-32 justify-center"
          on:click={() => {
            showTooltip = false;
            goto(`/${user.username}`);
          }}
        >
          <Fa icon={faUserCircle} class="mr-1" /> Profile
        </button>
        <button
          class="text-black block font-medium border border-black/25 rounded-full px-2 py-1 flex items-center w-32 justify-center"
          on:click={() => {
            showTooltip = false;
            if (!$session.user) {
              goto("/login");
            } else {
              $messageUser = { id: user.id, username: user.username };
              prompt.set(SendMessage);
            }
          }}
        >
          <Fa icon={faEnvelopeOpen} class="mr-1" /> Message</button
        >
        <button
          class="text-black block font-medium border border-black/25 rounded-full px-2 py-1 flex items-center w-32 justify-center"
          on:click={() => {
            showTooltip = false;
            if (!$session.user) {
              goto("/login");
            } else {
              $tipUser = { username: user.username, address: user.address };
              prompt.set(SendTip);
            }
          }}><Fa icon={faWallet} class="mr-1" /> Tip</button
        >
      </div>
      <div id="arrow" data-popper-arrow />
    </div>
  </OutClick>
{/if}

<div
  class={`${size} my-auto relative`}
  use:popperRef
  on:click={(e) => {
    if (!$session.user || (user && $session.user.username !== user.username)) {
      e.preventDefault();
      e.stopPropagation();
      showTooltip = !showTooltip;
    }
  }}
>
  <div
    class={`relative ${size} group rounded-full overflow-hidden shadow-inner text-center cursor-pointer`}
  >
    {#if user || src}
      <img
        key={user && user.username}
        src={user
          ? `/api/public/${user.avatar_url}`
          : src.startsWith("data") || src[0] === "/"
          ? src
          : `/api/public/${src}`}
        alt={user ? user.username : "lovely avatar"}
        class="absolute w-full h-full object-cover object-center visible overflow-hidden"
      />
    {/if}
  </div>
  {#if overlay}
    <img
      alt="Multisig"
      src={overlay}
      class="w-6 h-6 absolute"
      style="bottom: -8px; right: -20px"
    />
  {/if}
</div>

<style>
  .z {
    z-index: 1;
  }

  .small {
    @apply w-12 h-12;
  }

  .xs {
    @apply w-10 h-10;
  }

  .large {
    @apply w-16 h-16;
  }

  .xl {
    @apply w-56 h-56;
  }
</style>
