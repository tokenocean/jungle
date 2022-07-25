import { getCollectionByUsername } from "$queries/artworks";

export async function GET({ locals, params }) {
  let { username } = params;
  let { artworks } = await locals.q(getCollectionByUsername, { username });

  return {
    body: {
      artworks,
      count: artworks.length,
      username
    },
  };
}
