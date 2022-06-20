<script>
  import Fa from "svelte-fa";
  import {
    faChevronDown,
    faChevronUp,
    faTimes,
    faInfoCircle,
  } from "@fortawesome/free-solid-svg-icons";
  import { session } from "$app/stores";
  import { Avatar, Card, Head } from "$comp";
  import Sidebar from "./_sidebar.svelte";
  import { confirm, err, goto, info, linkify } from "$lib/utils";
  import { ACCEPTED } from "$lib/wallet";
  import { query } from "$lib/api";
  import { deleteArtwork } from "$queries/artworks";

  export let artwork, others, metadata;

  let loading, showMore, showPopup;

  let handleDelete = async () => {
    try {
      if ((await confirm()) === ACCEPTED) {
        await query(deleteArtwork, { id: artwork.id });
        info("Artwork deleted");
        goto("/market");
      }
    } catch (e) {
      err(e);
    }
  };
</script>

<Head {metadata} />

<div class="container mx-auto mt-10 md:mt-20">
  <div class="flex flex-wrap">
    <div class="lg:text-left w-full lg:w-1/3 lg:max-w-xs">
      <h1 class="text-3xl font-black primary-color">
        {artwork.title || "Untitled"}
      </h1>
      <div class="flex mt-4 mb-6">
        {#if !artwork.open_edition}
          <div class="my-auto">
            {artwork.editions.length}
            {#if artwork.max_editions}
              of {artwork.max_editions}
            {/if}
            Editions Minted
          </div>
        {:else}
          <div class="my-auto flex justify-center items-center">
            Open Edition | BTC Rewards <Fa
              class="mx-2 secondary-color"
              icon={faInfoCircle}
            />
          </div>
        {/if}
        {#if artwork.is_physical}
          <div
            class="flex ml-auto py-1 px-4 bg-gray-100 rounded rounded-full my-auto"
          >
            <div class="my-auto">
              <Fa icon={faImage} class="mr-1" />
            </div>
            <div class="my-auto mb-1">
              <span class="text-sm">Physical artwork</span>
            </div>
          </div>
        {/if}
      </div>

      <div class="flex flex-wrap justify-between text-left">
        <a href={`/${artwork.artist.username}`}>
          <div class="flex mb-6">
            <Avatar user={artwork.artist} />
            <div class="ml-2 secondary-color">
              <div>@{artwork.artist.username}</div>
              <div class="text-xs text-gray-600">Artist</div>
            </div>
          </div>
        </a>
      </div>

      <div class="mobileImage">
        <span on:click={() => (showPopup = !showPopup)}>
          <Card {artwork} columns={1} showDetails={false} thumb={false} />
        </span>
      </div>

      {#if $session?.user?.id === artwork.artist_id && !artwork.sold}
        <div class="w-full mb-2">
          <a
            href={`/a/${artwork.slug}/edit`}
            class="block text-center text-sm secondary-btn w-full">Edit</a
          >
        </div>
        <div class="w-full mb-2">
          <a
            href={`/a/${artwork.slug}/mint`}
            class="block text-center text-sm secondary-btn w-full">Mint</a
          >
        </div>
        <div class="w-full mb-2">
          <a
            href={"JavaScript:void(0)"}
            on:click={handleDelete}
            class="block text-center text-sm secondary-btn w-full cursor-pointer"
            >Delete</a
          >
        </div>
      {/if}

      <Sidebar bind:artwork />
    </div>

    {#if artwork.description}
      <div
        class="mob-desc description text-gray-600 whitespace-pre-wrap break-all"
      >
        <h4 class="mt-10 font-bold">About this artwork</h4>
        <div class="desc-text {showMore ? 'openDesc' : ''}">
          {@html linkify(artwork.description)}
        </div>
        <div class="show-more" on:click={() => (showMore = !showMore)}>
          SHOW
          {showMore ? "LESS -" : "MORE +"}
        </div>
      </div>
    {/if}

    <div class="w-full lg:w-2/3 lg:pl-40">
      <div class="desktopImage">
        <span on:click={() => (showPopup = !showPopup)}>
          <Card {artwork} columns={1} showDetails={false} thumb={false} />
        </span>
      </div>

      {#if artwork.description}
        <div class="desk-desc description text-gray-600">
          <h4 class="mt-10 mb-5 font-bold">About this artwork</h4>
          <div class="whitespace-pre-wrap">
            {@html linkify(artwork.description)}
          </div>
        </div>
      {/if}

      <div
        on:click={() => (showPopup = !showPopup)}
        class:showPopup
        class="popup"
      >
        <span class="closeButton"><Fa icon={faTimes} /></span>
        <Card
          {artwork}
          columns={1}
          showDetails={false}
          thumb={false}
          popup={true}
        />
      </div>

      {#if others.length}
        <div class="w-full mb-4">
          <h2 class="text-2xl font-bold primary-color py-10 px-0">
            More by this artist
          </h2>
          <div class="w-full grid md:grid-cols-3 gap-4 others">
            {#each others as artwork (artwork.id)}
              <Card {artwork} showDetails={false} noAudio={true} />
            {/each}
          </div>
        </div>
        <div class="flex w-full">
          <a
            class="primary-btn mx-auto mb-12"
            href={`/artist/${artwork.artist.username}`}>View all</a
          >
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(.description a) {
    color: #3ba5ac;
  }

  .disabled {
    pointer-events: none;
    @apply text-gray-400 border-gray-400;
  }

  button {
    @apply mb-2 w-full text-sm;
    &:hover {
      @apply border-green-700;
    }
  }

  .popup {
    position: fixed;
    z-index: 900;
    width: 100%;
    height: 100vh;
    padding: 5px;
    text-align: center;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: white;
    scroll-behavior: contain;
    transform: scale(0);
  }

  .showPopup {
    display: flex !important;
    align-items: center;
    justify-content: center;
    animation: zoom 0.2s ease forwards;
  }

  .closeButton {
    position: absolute;
    top: 50px;
    right: 50px;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background: whitesmoke;
    padding: 11px 15px;
    cursor: pointer;
  }

  .mob-desc {
    display: none;
  }

  .mobileImage {
    display: none;
    margin-bottom: 40px;
  }

  .mobileImage :global(.cover) {
    width: 100%;
  }

  .popup :global(video) {
    width: 50%;
    height: auto !important;
    margin: 0 auto;
  }

  .popup :global(div) {
    width: 100%;
    height: auto;
  }

  .popup :global(.card-link) {
    height: auto !important;
  }

  .popup :global(img) {
    margin: 0 auto;
    height: 95vh;
    object-fit: contain !important;
  }

  .desktopImage :global(img),
  .desktopImage :global(video) {
    margin: 0 auto;
  }

  @keyframes zoom {
    0% {
      transform: scale(0.6);
    }
    100% {
      transform: scale(1);
    }
  }

  @media only screen and (max-width: 1023px) {
    .desc-text {
      height: 150px;
      overflow: hidden;
    }

    .openDesc {
      height: auto !important;
      overflow: visible;
    }

    .show-more {
      color: #3ba5ac;
      font-weight: bold;
      text-align: right;
      margin-top: 10px;
      cursor: pointer;
      white-space: normal;
    }

    .desktopImage,
    .desk-desc {
      display: none;
    }

    .mobileImage,
    .mob-desc {
      display: block;
    }

    .closeButton {
      top: 20px;
      right: 20px;
    }
  }

  .others :global(img),
  .others :global(video) {
    height: 160px;
    width: 100%;
  }

  @media only screen and (max-width: 768px) {
    .popup :global(img),
    .popup :global(video) {
      height: auto;
      width: 100%;
    }

    .others :global(img),
    .others :global(video) {
      height: auto;
      width: 100%;
    }
  }
</style>
