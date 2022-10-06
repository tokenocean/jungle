<script>
  import { offset } from "$lib/store";
  import { onMount } from 'svelte';
  import Fa from "svelte-fa";
  import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
  export let loadMore, total;
  let pageSize = 21;
  let current = 0;
  let buttonLength = 5;

  $: pages = total > 0 ? [...Array(Math.ceil(total / pageSize)).keys()] : [];
  $: pagesLeft = pages.slice(current - 2, current)
  $: pagesRight = pages.slice(current, current + 2)

  console.log("pagesleft:", pagesLeft, "pagesRight:", pagesRight)
  let load = (page) => {
    current = page;
    $offset = page * pageSize;
    loadMore();
  };
      
</script>

<div class="full-width flex bg-white p-4 mx-auto">
  <div class="mx-auto">
    
    <div class="container flex mb-2">
      <i class="icon w-12 h-12" class:font-bold={current}
        on:click={() => load(0)}>
        <Fa icon={faChevronLeft} />
        <Fa icon={faChevronLeft} />
      </i>
      <i class="icon w-12 h-12" class:font-bold={current}
        on:click={() => load(current - 1)}>
        <Fa icon={faChevronLeft} />
      </i>
      {#each pages.slice(Math.max(current - 2, 0), Math.min(current +2, pages.length)) as _, i}
        <button
          class="rounded-full w-12 h-12"
          class:font-bold={i === current}
          on:click={() => load(i)}>{Math.max(current -2, i ) + 1}</button
        >
      {/each}
      <!-- {#each pagesRight as _, i}
        <button
          class="rounded-full w-12 h-12"
          class:font-bold={i === current}
          on:click={() => load(i)}>{i + 1}</button
        >
      {/each} -->
      <i class="icon w-12 h-12" class:font-bold={current}
        on:click={() => load(current + 1)}>
        <Fa icon={faChevronRight} />
      </i>
      <i class="icon w-12 h-12" class:font-bold={current}
        on:click={() => load(pages.length - 1)}>
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

