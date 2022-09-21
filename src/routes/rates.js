import { coinos } from "$lib/api";
export async function GET() {
  try {
    return {
      body: await coinos.url("/rates").get().json(),
    };
  } catch (e) {
    console.log(e);
    return {
      body: { message: "Problem getting rates" },
      status: 500,
    };
  }
}
