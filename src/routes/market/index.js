import { countArtworks, getLimited } from "$queries/artworks";

export async function GET({ locals: { q } }) {
  try {
    let {
      limit = 21,
      offset = 0,
      where = {},
      order_by = { created_at: "desc" },
    } = {};

    let { artworks_aggregate: a } = await q(countArtworks, { where });
    let { artworks } = await q(getLimited, { limit, offset, order_by, where });

    return {
      body: {
        initialArtworks: artworks,
        total: a.aggregate.count,
      },
    };
  } catch (e) {
    console.log("problem fetching artworks", e);
    return {
      body: {},
      status: 500,
    };
  }
}
