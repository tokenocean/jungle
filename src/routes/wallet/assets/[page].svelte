<script>
  import { session } from "$app/stores";
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
  import { goto } from "$lib/utils";
  import { confirmed } from "$lib/store";
  import { ProgressLinear } from "$comp";
  import { btc, cad, usd, val } from "$lib/utils";
  import { border, bg, outer } from "../_colors";

  export let assets,
    count,
    page = 1;
  let offset = 25;
  let pages = new Array(Math.ceil(count / offset));
</script>

<div class="container mx-auto">
  <div class="mb-5">
    <a href="/wallet" class="text-midblue">
      <div class="flex">
        <Fa icon={faChevronLeft} class="my-auto mr-1" />
        <div>Back</div>
      </div>
    </a>
  </div>
  <div class="dark-bg p-4 rounded-lg">
    {#each assets as a}
      <a href={`/wallet/${a.asset}`} sveltekit:prefetch>
        <div class="flex mb-2 cursor-pointer">
          <div class={`py-2 ${outer(a.asset)} w-3 rounded-l-lg`} />
          <div
            class={`flex ${bg(
              a.asset
            )} text-gray-300 rounded-r-lg p-4 flex-grow ${border(a.asset)}`}
          >
            <div class="flex-grow">{a.name}</div>
          </div>
        </div>
      </a>
    {/each}
  </div>

  {#if pages.length > 1}
    <div class="full-width flex bg-white p-4 mx-auto">
      <div class="mx-auto">
        {#each pages as _, i}
          <a href={`/wallet/assets/${i + 1}`}>
            <button
              class="rounded-full w-12 h-12"
              class:font-bold={i + 1 === page}
            >
              {i + 1}
            </button>
          </a>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .bg-btc {
    background: #3f6777;
  }
  .outer-btc {
    background: #30bfad;
  }
  .border-btc {
    border-color: #30bfad;
  }

  .dark-red {
    background: #2b0208;
  }
  .dark-yellow {
    background: #31240c;
  }
  .dark-green {
    background: #082527;
  }
  .dark-gray {
    background: #31373e;
  }
  .border-blue {
    border-color: #6ed8e0;
  }

  .active {
    @apply border-t-2 border-b-2 border-r-2 text-white;
  }
</style>
