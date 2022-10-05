<script>
  import { offset } from "$lib/store";
  export let loadMore, total;

  let pageSize = 21;
  let current = 0;

  $: pages = total > 0 ? [...Array(Math.ceil(total / pageSize)).keys()] : [];
  let load = (page) => {
    current = page;
    $offset = page * pageSize;
    loadMore();
  };
</script>

<div class="full-width flex bg-white p-4 mx-auto">
  <div class="mx-auto">
    {#each pages as _, i}
      <button
        class="rounded-full w-12 h-12"
        class:font-bold={i === current}
        on:click={() => load(i)}>{i + 1}</button
      >
    {/each}
  </div>
</div>
