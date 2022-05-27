import { checkToken } from "$lib/auth";
import { newapi as api } from "$lib/api";

export async function get({ request: { headers }, locals: { q } }) {
  let r = checkToken(headers);
  if (r) return r;

  try {
    let transactions = await api(headers).url("/transactions").get().json();

    return {
      body: { transactions }
    };
  } catch (e) {
    console.log(e);
    return {
      body: { message: "Problem getting transactions" },
      status: 500,
    };
  }
}
