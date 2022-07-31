import { serverApi } from "$lib/api";
export async function GET({ request: { headers }, locals: { q } }) {
  try {
    return {
      body: await serverApi.url("/transactions").headers(headers).get().json(),
    };
  } catch (e) {
    console.log(e);
    return {
      body: { message: "Problem getting transactions" },
      status: 500,
    };
  }
}
