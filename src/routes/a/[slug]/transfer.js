import { getArtworkBySlug } from "$queries/artworks";
import { getUsers } from "$queries/users";

export async function GET({ locals: { q }, params, request }) {
  let { slug } = params;
  let { artworks } = await q(getArtworkBySlug, { slug });
  let artwork = artworks[0];

  let { users } = await q(getUsers);

  return {
    body: { artwork, users },
  };
}
