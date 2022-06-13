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

  let artwork;
  if (validate(slug)) {
    ({ artworks_by_pk: artwork } = await q(getArtwork, { id: slug }));
  } else {
    let { artworks } = await q(getArtworkBySlug, { slug });
    artwork = artworks[0];
  }

  if (!artwork) return { status: 500 };

  let { artworks: others } = await q(getArtworksByArtist, {
    id: artwork.artist_id,
    limit: 5,
  });

  let { id } = artwork;

  others = others.filter((a) => a.id !== artwork.id).slice(0, 3);

  // await api(headers).url("/held").post({ id }).json();
  // await api(headers).url("/viewed").post({ id }).json();
  artwork.views++;

  let metadata = { ...branding.meta };
  metadata.title = metadata.title + " - " + artwork.title;
  metadata.keywords =
    metadata.keywords + " " + artwork.tags.map((t) => t.tag).join(" ");
  metadata.description = artwork.description.replace(/(?:\r\n|\r|\n)/g, " ");

  let type = "image";
  metadata[type] = `${host}/api/public/${artwork.filename}.png`;
  if (artwork.filetype.includes("video")) type = "video";

  metadata[type] = `${host}/api/public/${artwork.filename}.${
    artwork.filetype.split("/")[1]
  }`;

  return {
    body: {
      artwork,
      metadata,
      others,
    },
  };
}
