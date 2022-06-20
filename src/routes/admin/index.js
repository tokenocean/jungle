import { getSamples } from "$queries/users";

export async function get({ request: { headers }, locals: { q }, params }) {
  return {
    body: {
      users: (
        await q(getSamples, undefined, {
          ...headers,
          "x-hasura-role": "approver",
        })
      ).users.sort(
        (a, b) => a.username && a.username.localeCompare(b.username)
      ),
    },
  };
}
