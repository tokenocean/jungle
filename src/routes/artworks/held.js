import { serverApi } from "$lib/api";
export async function POST({ request }) {
  try {
    let body = await request.json();
    return {
      body: await serverApi.url("/held").post(body).json(),
    };
  } catch (e) {
    console.log(e);
    return {
      body: { message: "Problem checking held status" },
      status: 500,
    };
  }
}
