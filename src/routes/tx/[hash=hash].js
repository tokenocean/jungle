import { newapi as api } from "$lib/api";
import reverse from "buffer-reverse";
import { getHex } from "$lib/wallet";
import { address as Address, Psbt } from "liquidjs-lib";

export async function GET({ params }) {
  try {
    let hex = await getHex(params.hash);
    return {
      body: { hex },
    };
  } catch (e) {
    console.log(e);
    return {
      body: { message: "Problem getting transaction" },
      status: 500,
    };
  }
}
