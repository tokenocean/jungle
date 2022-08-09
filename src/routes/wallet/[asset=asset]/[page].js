import { newapi as api } from "$lib/api";
export async function GET({ params }) {
  let { page } = params;
  page = parseInt(page);

  let asset = await api().url(`/asset/${params.asset}`).get().json();

  return {
    body: { asset, page },
    cache: { maxage: 3600 },
  };
}
