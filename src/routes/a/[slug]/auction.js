import { getArtworkBySlug } from "$queries/artworks";
import { getDefaultRoyaltyRecipients } from "$queries/royalty_recipients";

export async function GET({ locals: { user, q }, params }) {
  let { slug } = params;
  let { artworks } = await q(getArtworkBySlug, { slug });
  let artwork = artworks[0];

  let { default_royalty_recipients } = await q(getDefaultRoyaltyRecipients);

  if (!artwork) return { status: 404 };

  return {
    body: {
      artwork,
      default_royalty_recipients,
      user
    },
  };
}
