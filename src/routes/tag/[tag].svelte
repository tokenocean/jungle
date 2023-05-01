<script>
  import { query } from "$lib/api";
  import { page } from "$app/stores";
  import { getArtworksByTag } from "$queries/artworks";
  import { Card } from "$comp";
  import galleries from "$lib/galleries";
  import { err } from "$lib/utils";

  let { tag } = $page.params;
  let artworks = [];
  $: query(getArtworksByTag(tag))
    .then((res) => (artworks = res.artworks))
    .catch(err);
</script>

<div class="container mx-auto mt-10 md:mt-20">
  {#if tag.toLowerCase() !== "event"}
    <h3 class="mb-10">{galleries[tag] ? galleries[tag] : `#${tag}`}</h3>
  {:else}
    <h3 class="mb-10">The Event Tickets Gallery</h3>

    <div class="card border-l-8">
      <p>
        Welcome to the NFT Event Tickets Gallery on JungleLab! Here, you'll find a vibrant showcase of cutting-edge NFT event tickets created by visionary artists, graphic designers, and memelords from around the world.
        Create a ticket for your event and share it with the world. Sign in to buy or view your tickets and manage your events.
      </p>
      <p>
        Our gallery features a diverse range of events, from music festivals to art exhibitions, each one designed to capture the unique spirit and energy of its creator. And because all of our event tickets are NFTs on the Liquid Network, you can be sure that each one is secure, transparent, and tamper-proof. 
      </p>
    </div>

    <div class="card border-r-8">
      <p>
        But the Event Tickets Gallery is more than just a showcase of stunning artwork. It's also a dynamic platform for creators and enthusiasts alike to connect, collaborate, and explore the limitless potential of NFTs and decentralized finance, Join us in building a world that's more dynamic and exciting than ever before! with the tag #ticket.
      </p>
      <p>
        So whether you're an artist looking to showcase your work, an event organizer looking for inspiration, or simply a crypto enthusiast eager to explore the cutting-edge world of NFTs, we invite you to join us on JungleLab and discover the future of event tickets!
      </p>
    </div>
  {/if}

  <div class="flex flex-wrap">
    {#each artworks as artwork (artwork.id)}
      <div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 pr-6 mb-10">
        <Card {artwork} />
      </div>
    {/each}
  </div>
</div>

<style>
  p {
    @apply mb-4;
  }

  .card {
    @apply border-primary p-4 pl-8 shadow-md mb-12;
  }
</style>
