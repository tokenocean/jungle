import { getArtworksByUsername } from "$queries/artworks";

export async function GET({ locals, params }) {
  let { username } = params;
  let { artworks } = await locals.q(getArtworksByUsername(username));

  return {
    body: {
      artworks,
      count: artworks.length
    },
  };
}
