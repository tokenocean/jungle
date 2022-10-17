<script>
  import { browser } from "$app/env";
  import { Card, Pagination } from "$comp";
  import { onMount, tick } from "svelte";

  export let filtered;
  export let total;
  export let loadMore;
  let currentPage = 0;
</script>

<Pagination bind:current={currentPage} {loadMore} {total} />

<div id="content">
  <div class="sm:grid sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
    {#each filtered as artwork, i}
      <div class="market-gallery w-full mb-20">
        <Card noAudio={true} {artwork} height={350} />
      </div>
    {/each}
  </div>
</div>

<Pagination bind:current={currentPage} {loadMore} {total} />

<style>
  .full-width {
    width: 100%;
    left: calc(100vw - 100%);
  }
</style>
