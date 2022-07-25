import { serverApi } from "$lib/api";
export async function POST({ request }) {
  try {
    let body = await request.json();
    return {
      body: await serverApi.url("/viewed").post(body).json(),
    };
  } catch (e) {
    console.log(e);
    return {
      body: { message: "Problem incrementing view count" },
      status: 500,
    };
  }
}
