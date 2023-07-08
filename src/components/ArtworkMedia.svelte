<script>
  import { onMount } from "svelte";
  import Fa from "svelte-fa";
  import {
    faVolumeUp,
    faVolumeMute,
    faHeadphones,
  } from "@fortawesome/free-solid-svg-icons";
  import { CID } from "multiformats/cid";

  export let artwork;
  export let showDetails;
  export let thumb = true;
  export let preview = false;
  export let popup = false;
  export let classes = "";
  export let noAudio = false;

  let img, vid, aud;
  $: cid = artwork.filename && CID.parse(artwork.filename).toV1().toString();
  $: ext =
    !artwork.filetype || artwork.filetype.match(/video|gif|octet/)
      ? "webm"
      : "webp";
  $: path =
    artwork &&
    (thumb
      ? `/api/public/${artwork.filename}.${ext}`
      : `/api/ipfs/${artwork.filename}`);

  $: cover = !showDetails;
  $: contain = showDetails;

  function hasAudio(v) {
    if (!v) return false;
    return (
      v.mozHasAudio ||
      Boolean(v.webkitAudioDecodedByteCount) ||
      Boolean(v.audioTracks && v.audioTracks.length)
    );
  }

  let muted = true;
  let invisible = true;

  let over = () => vid && hasAudio(vid) && (invisible = false);
  let out = () => (invisible = true);

  let toggleSound = () => {
    muted = !muted;
    vid.muted = muted;
  };
</script>

{#if !artwork.filetype || artwork.filetype.includes("video") || (thumb && artwork.filetype.includes("gif"))}
  <div
    class="w-full"
    class:inline-block={!popup}
    class:cover
    class:contain
    on:mouseover={over}
    on:focus={over}
    on:mouseout={out}
    on:blur={out}
  >
    <video
      class={`${classes}`}
      autoplay
      muted
      playsinline
      loop
      bind:this={vid}
      controls={popup}
    >
      <source src={preview || path} />
      Your browser does not support HTML5 video.
    </video>
    {#if !popup}
      <button
        class="absolute hidden md:block bottom-2 right-2 secondary-color"
        type="button"
        class:invisible
        on:click|stopPropagation|preventDefault={toggleSound}
      >
        <Fa icon={muted ? faVolumeMute : faVolumeUp} size="1.5x" />
      </button>
    {/if}
  </div>
{:else if artwork.filetype && artwork.filetype.includes("audio")}
  <div
    class="p-5 bg-primary/50 flex justify-center items-center h-full w-full mx-auto rounded-lg"
  >
    <img src class="hidden" bind:this={aud} alt="" />
    <figure>
      <Fa icon={faHeadphones} class="mx-auto" size="3x" />

      {#if noAudio === false}
        <audio class="mx-auto" controls src={preview || path}>
          Your browser does not support the
          <code>audio</code> element.
        </audio>
      {/if}
      <figcaption class="text-center">NFT audio file</figcaption>
    </figure>
  </div>
{:else}
  <div class="w-full" class:cover class:contain>
    <img
      class={`${classes}`}
      src={preview || (path ? path : "/liquid_logo.svg")}
      alt={artwork.title}
      bind:this={img}
    />
  </div>
{/if}

<style>
  .contain,
  .cover {
    width: 100%;
    position: relative;
  }

  .contain img,
  .contain video {
    height: 350px;
    width: 100%;
    object-fit: cover;
  }

  img,
  video {
    max-height: 70vh;
    margin-left: auto;
    margin-right: auto;
  }

  video {
    width: auto;
  }
</style>