import { newapi as api } from "$lib/api";
import { browser } from "$app/env";
import branding from "$lib/branding";
import { host } from "$lib/utils";
import { validate } from "uuid";
import {
  getArtwork,
  getArtworksByArtist,
  getArtworkBySlug,
} from "$queries/artworks";
import { getArtworkTransactions } from "$queries/transactions";

export async function get({ request: { headers }, locals, params }) {
  let { slug } = params;
  let { q } = locals;

  console.log("SLUG", slug);

  let { artworks } = await q(getArtworkBySlug, { slug });

  if (artworks.length === 1) {
    return {
      status: 302,
      headers: {
        location: `/a/${slug}/1`
      } 
    } 
  } 

  return {
    body: {
      editions: artworks[0].editions,
    },
  };
}
