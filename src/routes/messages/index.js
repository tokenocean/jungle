import { getMessages } from "$queries/messages.js";
import { checkToken } from "$lib/auth";
export async function get({ request: { headers }, locals: { q } }) {
  let r = checkToken(headers);
  if (r.status) return r;

  let body = await q(getMessages, undefined, r);

  return { body };
}
