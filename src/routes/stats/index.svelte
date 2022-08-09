<script context="module">
  export async function load({ session }) {
    if (!session?.user?.is_admin)
      return {
        status: 302,
        redirect: "/login",
      };

    return {};
  }
</script>

<script>
  import {
    getUserStats,
    getArtworksStats,
    getArtistsStats,
  } from "$queries/stats";
  import StatCard from "./card.svelte";
  import { page } from "$app/stores";
  import { goto } from "$lib/utils";
  import { requireLogin } from "$lib/auth";
  import { user } from "$lib/store";

  $: pageChange($page, $user);
  let pageChange = async () => {
    try {
      await requireLogin();
      if (!$user?.is_admin) goto("/");
    } catch (error) {
      err(error);
    }
  };
</script>

<div class="container mx-auto mt-20">
  <h2 class="mb-10">User Stats</h2>

  <div class="flex flex-wrap -mx-4">
    <StatCard query={getUserStats} title="Number of users" />
    <StatCard query={getArtworksStats} title="Number of artworks" />
    <StatCard query={getArtistsStats} title="Number of artists" />
  </div>
</div>

<style>
</style>
