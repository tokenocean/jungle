<script>
  import { offset } from "$lib/store";
  import Fa from "svelte-fa";
  import {
    faChevronLeft,
    faChevronRight,
  } from "@fortawesome/free-solid-svg-icons";
  export let loadMore, total, current, scroll;
  let pageSize = 21;
  
  let w;
  $: buttons = w > 800 ? 5 : 1;

  $: pages = total > 0 ? [...Array(Math.ceil(total / pageSize)).keys()] : [];

  $: start =
    current >= pages.length - buttons
      ? pages.length - buttons
      : Math.max(0, current - Math.floor(buttons / 2));
  $: slice = pages.slice(start, start + buttons);

  let load = (page) => {
    if (scroll) scrollTo(0, 0);
    current = page;
    $offset = page * pageSize;
    loadMore();
  };
</script>

<svelte:window bind:innerWidth={w} />

<div class="flex bg-white p-4 mx-auto">
  <div class="mx-auto">
    <div class="container flex mb-2">
      <i
        class="icon w-12 h-12"
        class:font-bold={current}
        on:click={() => load(0)}
      >
        <Fa icon={faChevronLeft} />
        <Fa icon={faChevronLeft} />
      </i>
      <i
        class="icon w-12 h-12"
        class:font-bold={current}
        on:click={() => current > 0 && load(current - 1)}
      >
        <Fa icon={faChevronLeft} />
      </i>
      {#each slice as p}
        <button
          class="rounded-full w-12 h-12"
          class:font-bold={p === current}
          on:click={() => load(p)}>{p + 1}</button
        >
      {/each}
      <i
        class="icon w-12 h-12"
        class:font-bold={current}
        on:click={() => current < pages.length - 1 && load(current + 1)}
      >
        <Fa icon={faChevronRight} />
      </i>
      <i
        class="icon w-12 h-12"
        class:font-bold={current}
        on:click={() => load(pages.length - 1)}
      >
        <Fa icon={faChevronRight} />
        <Fa icon={faChevronRight} />
      </i>
    </div>
  </div>
</div>

<style>
  button {
    border: 1px solid black;
    border-radius: 5px;
    margin: 3px;
  }

  .icon {
    border: 1px solid black;
    border-radius: 5px;
    margin: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
</style>
