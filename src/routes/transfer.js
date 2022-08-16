import { getUsers } from "$queries/users";
import { checkToken } from "$lib/auth";

export async function GET({ locals: { q, user }, params }) {
  try {
    let r = checkToken(headers);
    if (r.status) return r;

    let { artworks } = await q(getArtworkBySlug, { slug });
    let artwork = artworks[0];
    let { users } = await q(getUsers);

    return { body: { artwork, users } };
  } catch (e) {
    console.log("problem loading data for transfer", e);
    return {
      body: {},
      status: 500,
    };
  }
}
