import { newapi as api } from "$lib/api";
export async function GET({ params }) {
  return {
    body: { asset: await api().url(`/asset/${params.asset}`).get().json() },
    cache: { maxage: 3600 },
  };
}
