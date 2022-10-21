<script context="module">
  export async function load({ fetch }) {
    const props = await fetch(`/artworks/recent`).then((r) => r.json());

    return {
      props,
    };
  }
</script>

<script>
  import { onMount, onDestroy } from "svelte";
  import { query } from "$lib/api";
  import { Summary } from "$comp";
  import { fade } from "svelte/transition";
  import { Activity, RecentActivityCard, LatestPiecesCard } from "$comp";
  import { err } from "$lib/utils";
  import branding from "$lib/branding";
  import { prefetch } from "$app/navigation";
  import { browser } from "$app/env";
  onMount(() => browser && prefetch("/market"));
  export let featured;
  export let recent;
  export let latest;
  let current = 0;
  $: artwork = featured && featured[current] && featured[current].artwork;
  let interval = setInterval(() => {
    if (!featured) return;
    current++;
    if (current >= featured.length) current = 0;
  }, 6000);
  onDestroy(() => clearInterval(interval));
</script>

<div class="flex header-container mx-auto justify-center marg-bottom">
  <div class="header text-center">
    <h1 class="text-left md:text-center md:w-full">
      {branding.projectName}
      <br />music video art
    </h1>
    <h5 class="md:max-w-lg mx-auto text-left md:text-center">
      Upload, collect, and transact rare dank digital assets on the Liquid
      Bitcoin Network
    </h5>
    <a class="primary-btn" href={`/market`}>Start exploring</a>
  </div>
</div>

{#if artwork}
  <div class="flex secondary-header marg-bottom">
    <div
      class="container flex mx-auto flex-col justify-end md:justify-center secondary-header-text m-10 pl-6 z-10"
    >
      <div class="blur-bg">
        <h2>{artwork.artist.username}</h2>
        <p>
          {artwork.title}

          {#if new Date() < new Date("2022-04-15")}
            <a href="/tag/bitcoinbond">
              <button
                class="button-transparent header-button border mt-10"
                style="border-color: white; color: white"
              >
                Visit The Bitcoin Bond Gallery</button
              ></a
            >
          {:else}
            <a href="/a/{artwork.slug}">
              <button
                class="button-transparent header-button border mt-10"
                style="border-color: white; color: white"
              >
                View Artwork</button
              ></a
            >
          {/if}
        </p>
      </div>
    </div>

    {#if artwork.filetype.includes("video")}
      <video
        in:fade
        out:fade
        class="lazy cover absolute secondary-header"
        autoplay
        muted
        playsinline
        loop
        src={`/api/public/${artwork.filename}.webm`}
        :key={featured[current].id}
      />
    {:else}
      <img
        in:fade
        out:fade
        class="lazy cover absolute secondary-header"
        alt={artwork.title}
        src={`/api/public/${artwork.filename}.webp`}
      />
    {/if}
  </div>
{/if}

<div class="container mx-auto px-10">
  <h3>Recent Activity</h3>
</div>
<div class="container mx-auto flex overflow-x-auto">
  {#each recent as transaction}
    <RecentActivityCard {transaction} />
  {/each}
</div>
<div class="container more marg-bottom">
  <a class="secondary-btn" href={"/activity"}>View more</a>
</div>

<div class="container mx-auto px-10">
  <h3>Latest Pieces</h3>
</div>
<div class="container mx-auto flex pb-1 overflow-x-auto">
  {#each latest as transaction}
    <LatestPiecesCard {transaction} />
  {/each}
</div>
<div class="container more marg-bottom">
  <a class="secondary-btn" href={"/market"}>View gallery</a>
</div>

<!--
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
-->
<div class="bg-white-100">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto py-16 sm:py-24 lg:py-32 lg:max-w-none">
      <h2 class="text-2xl font-extrabold text-gray-900">
        Rare Dank Collections
      </h2>

      <div
        class="mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-6"
      >
        <div class="group relative">
          <div
            class="relative w-full h-80 bg-white rounded-lg overflow-hidden group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1"
          >
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDh8fG11c2ljfGVufDB8fHx8MTY0MDAxNTcxMA&ixlib=rb-1.2.1&q=80&w=2000"
              alt="Collection of music digital assets."
              class="w-full h-full object-center object-cover"
            />
          </div>
          <h3 class="mt-6 text-sm text-gray-500">
            <a href="https://junglelab.net/music/">
              <span class="absolute inset-0" />
              Music
            </a>
          </h3>
          <p class="text-base font-semibold text-gray-900">Artist Exclusives</p>
        </div>

        <div class="group relative">
          <div
            class="relative w-full h-80 bg-white rounded-lg overflow-hidden group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1"
          >
            <img
              src="https://images.unsplash.com/photo-1554941829-202a0b2403b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDMzfHx2aWRlb3xlbnwwfHx8fDE2NDAwMjA4ODM&ixlib=rb-1.2.1&q=80&w=2000"
              alt="Collection of video digital assets."
              class="w-full h-full object-center object-cover"
            />
          </div>
          <h3 class="mt-6 text-sm text-gray-500">
            <a href="https://junglelab.net/video/">
              <span class="absolute inset-0" />
              Video
            </a>
          </h3>
          <p class="text-base font-semibold text-gray-900">Artist Exclusives</p>
        </div>

        <div class="group relative">
          <div
            class="relative w-full h-80 bg-white rounded-lg overflow-hidden group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1"
          >
            <img
              src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDExfHxhcnR8ZW58MHx8fHwxNjQwMDIwOTM4&ixlib=rb-1.2.1&q=80&w=2000"
              alt="Collection of digital art assets."
              class="w-full h-full object-center object-cover"
            />
          </div>
          <h3 class="mt-6 text-sm text-gray-500">
            <a href="https://junglelab.net/art/">
              <span class="absolute inset-0" />
              Art
            </a>
          </h3>
          <p class="text-base font-semibold text-gray-900">Artist Exclusives</p>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- This is the information area -->
<div class="py-12 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="lg:text-center">
      <h2 class="text-base text-black font-semibold tracking-wide uppercase">
        Liquid Bitcoin Digital Assets
      </h2>
      <p
        class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
      >
        INVEST IN ARTISTS. INVEST IN MUSIC, INVEST IN NFT EVENT TICKETS.
      </p>
    </div>
    <div class="mt-10">
      <dl
        class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10"
      >
        <div class="relative">
          <dt>
            <div
              class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-500 text-white"
            >
              <!-- Heroicon name: outline/globe-alt -->
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
            </div>
            <p class="ml-16 text-lg leading-6 font-medium text-gray-900">
              Global Market
            </p>
          </dt>
          <dd class="mt-2 ml-16 text-base text-gray-500">
            Jungle Lab is a revolutionary urban lifestyle NFT platform for
            artists, creatives and collectors to upload and transact rare
            digital assets including music, videos and art.
          </dd>
        </div>

        <div class="relative">
          <dt>
            <div
              class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-500 text-white"
            >
              <!-- Heroicon name: outline/scale -->
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
            </div>
            <p class="ml-16 text-lg leading-6 font-medium text-gray-900">
              Scale Faster
            </p>
          </dt>
          <dd class="mt-2 ml-16 text-base text-gray-500">
            Streamlining talent eCommerce portfolio and process - Manage all
            your digital products/assets in one place i.e. albums, mixtapes,
            singles, events, merchandise and exclusive artwork.
          </dd>
        </div>

        <div class="relative">
          <dt>
            <div
              class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-500 text-white"
            >
              <!-- Heroicon name: outline/lightning-bolt -->
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <p class="ml-16 text-lg leading-6 font-medium text-gray-900">
              Liquid Network
            </p>
          </dt>
          <dd class="mt-2 ml-16 text-base text-gray-500">
            We exist to support millions of users & artists + creatives with an
            eco-system that provides rights, ownership, and the opportunity to
            create multiple independent revenue streams, Supported by
            Blockstream & Raretoshi.
          </dd>
        </div>

        <div class="relative">
          <dt>
            <div
              class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-500 text-white"
            >
              <!-- Heroicon name: outline/annotation -->
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            </div>
            <p class="ml-16 text-lg leading-6 font-medium text-gray-900">
              Top Artists
            </p>
          </dt>
          <dd class="mt-2 ml-16 text-base text-gray-500">
            Help you adopt exclusive community - Adopt special privileges for
            your fanbase that follows you on our platform. i.e. early ticket
            release, exclusive events backstage passes attached to digital
            assets.
          </dd>
        </div>
      </dl>
    </div>
  </div>
</div>

<!--
  This example2 requires Tailwind CSS v2.0+ 
  
  This example2 requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
-->
<div class="bg-white-100">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto py-16 sm:py-24 lg:py-32 lg:max-w-none">
      <h2 class="text-2xl font-extrabold text-gray-900">
        Rare Dank Collections
      </h2>

      <div
        class="mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-6"
      >
        <div class="group relative">
          <div
            class="relative w-full h-80 bg-white rounded-lg overflow-hidden group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1"
          >
            <img
              src="https://images.unsplash.com/photo-1578575436955-ef29da568c6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDF8fHRpY2tldHxlbnwwfHx8fDE2NDk4NzE3ODU&ixlib=rb-1.2.1&q=80&w=2000"
              alt="Collection of digital assets."
              class="w-full h-full object-center object-cover"
            />
          </div>
          <h3 class="mt-6 text-sm text-gray-500">
            <a href="https://junglelab.net/nft-event-tickets/">
              <span class="absolute inset-0" />
              NFT Event Tickets
            </a>
          </h3>
          <p class="text-base font-semibold text-gray-900">
            Exclusive NFT Event Tickets
          </p>
        </div>

        <div class="group relative">
          <div
            class="relative w-full h-80 bg-white rounded-lg overflow-hidden group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1"
          >
            <img
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.MxbiqZwrs_YFQAXhSOjzVQHaE8%26pid%3DApi&f=1"
              alt="Collection of digital assets."
              class="w-full h-full object-center object-cover"
            />
          </div>
          <h3 class="mt-6 text-sm text-gray-500">
            <a href="https://junglelab.net/nft-event-tickets/">
              <span class="absolute inset-0" />
              Festival
            </a>
          </h3>
          <p class="text-base font-semibold text-gray-900">
            Exclusive Festivals
          </p>
        </div>

        <div class="group relative">
          <div
            class="relative w-full h-80 bg-white rounded-lg overflow-hidden group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1"
          >
            <img
              src="https://images.unsplash.com/photo-1579664531470-ac357f8f8e2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDIwfHxNZXJjaGFuZGlzZXxlbnwwfHx8fDE2NTExNTgyOTI&ixlib=rb-1.2.1&q=80&w=2000"
              alt="Collection of digital assets."
              class="w-full h-full object-center object-cover"
            />
          </div>
          <h3 class="mt-6 text-sm text-gray-500">
            <a href="https://junglelab.net/merchandise/">
              <span class="absolute inset-0" />
              Merchandise
            </a>
          </h3>
          <p class="text-base font-semibold text-gray-900">
            Exclusive Merchandise
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .header {
    width: 90%;
    margin-top: 128px;
  }
  .header .primary-btn {
    width: 240px;
    margin: 0 auto;
  }
  .header h5 {
    font-size: 22px;
    line-height: 36px;
    color: #2d2e32;
    margin-top: 24px;
    margin-bottom: 34px;
  }
  .secondary-header {
    height: 600px !important;
    width: 100%;
    object-fit: cover;
  }
  .blur-bg {
    display: flex;
    padding: 60px;
    flex-direction: column;
    background: rgba(54, 58, 74, 0.45);
    backdrop-filter: blur(30px);
    box-shadow: 2px 2px 4px 0 rgb(0 0 0 / 10%);
    border-radius: 8px;
    color: white;
    width: 50%;
    width: fit-content;
  }
  .blur-bg h2 {
    color: white !important;
  }
  .blur-bg p {
    color: white !important;
    margin-top: 20px;
  }
  .container.more {
    display: flex;
    justify-content: center;
    margin: 0 auto;
    margin-top: 36px;
  }
  .more .secondary-btn {
    width: 180px;
  }
  .header-button {
    border: 1px solid;
    border-radius: 30px;
    padding: 0.7rem 1.5rem !important;
  }
  h3 {
    margin-bottom: 36px;
  }
  .marg-bottom {
    margin-bottom: 128px !important;
  }
  @media only screen and (max-width: 768px) {
    .header-container.marg-bottom {
      margin-bottom: 96px !important;
    }
    .header {
      margin-top: 64px;
    }
    h3 {
      margin-bottom: 32px;
    }
    .header h5 {
      margin-top: 24px;
      margin-bottom: 24px;
    }
    .header .primary-btn {
      width: 100%;
    }
    .secondary-header {
      height: 400px !important;
    }
    .container.more {
      margin-top: 48px;
    }
    .marg-bottom {
      margin-bottom: 96px !important;
    }
    .blur-bg {
      padding: 24px;
      width: 75%;
      width: fit-content;
    }
  }
</style>
