import { checkToken } from "$lib/auth";
import { getUserByUsername } from "$queries/users";
export async function GET({
  request: { headers },
  locals: { q, user },
  params: { username },
}) {
  try {
    let { users } = await q(getUserByUsername, { username, artworksLimit: 10 });

    if (!users.length) throw new Error("user not found");

    let r = checkToken(headers);
    return {
      body: {
        subject: users[0],
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
