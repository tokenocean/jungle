import { getMessages } from "$queries/messages.js";
import { checkToken } from "$lib/auth";
import { getUserByUsername } from "$queries/users";
export async function get({
  request: { headers },
  locals: { q, user },
  params: { username },
}) {
  try {
    let { users } = await q(getUserByUsername, { username, artworksLimit: 10 });

    if (!users.length) throw new Error("user not found");

    let r = checkToken(headers);
    let messages = [];
    if (!r.status && user.username === username) {
      ({ messages } = await q(getMessages, undefined, r));
    }
    return {
      body: {
        subject: users[0],
        messages,
      },
      headers,
    };
  } catch (e) {
    console.log(e);
    return {
      body: {},
      status: 500,
    };
  }
}
