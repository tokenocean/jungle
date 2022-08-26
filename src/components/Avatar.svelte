<script>
  import { createPopperActions } from "svelte-popperjs";
  import { UserPopup } from "$comp";
  import { network } from "$lib/wallet";
  import OutClick from "svelte-outclick";
  import { user as currentuser } from "$lib/store";

  export let user = undefined;
  export let src = undefined;
  export let overlay = undefined;
  export let size = "small";
  export let disablePopup = false;

  const [popperRef, popperContent] = createPopperActions({
    placement: "right",
  });

  let showPopup = false;
</script>

{#if showPopup}
  <OutClick on:outclick={() => (showPopup = false)}>
    <UserPopup bind:showPopup {user} {popperContent} />
  </OutClick>
{/if}

<div
  class={`${size} my-auto relative`}
  use:popperRef
  on:click={(e) => {
    if (user && (!$currentuser || (user && $currentuser.username !== user.username)) && !disablePopup) {
      e.preventDefault();
      e.stopPropagation();
      showPopup = !showPopup;
    }
  }}
>
  <div
    class={`relative ${size} group rounded-full overflow-hidden shadow-inner text-center`}
           class:cursor-pointer={user}
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
