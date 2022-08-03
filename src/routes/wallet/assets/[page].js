import { checkToken } from "$lib/auth";
import { newapi as api } from "$lib/api";

export async function GET({ request: { headers }, params }) {
  let r = checkToken(headers);
  if (r.status) return r;
 
  try {
    let { page = 1 } = params;
    let assets = await api(headers).url(`/assets/${page}`).get().json();
    let count = await api(headers).url(`/assets/count`).get().json();
    page = parseInt(page);
    return {
      body: { assets, count, page },
      cache: {
        maxage: 3600
      } 
    };
  } catch (e) {
    console.log(e);
    return {
      body: { message: "Problem loading assets" },
      status: 500,
    };
  }
}
