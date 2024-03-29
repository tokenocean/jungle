import { serverApi } from "$lib/api";
import cookie from "cookie";
import { addSeconds } from "date-fns";
import { getUser } from "$queries/users";

export async function POST({ locals, request }) {
  let { q } = locals;

  try {
    let body = await request.json();
    const res = await serverApi.url("/login").post(body).res();
    body = await res.json();
    let { jwt_expires_in, jwt_token } = body;

    let tokenExpiry = parseInt(jwt_expires_in / 1000);

    let { currentuser } = await q(getUser, undefined, {
      authorization: `Bearer ${jwt_token}`,
    });
    body.user = currentuser[0];

    return {
      body,
      headers: {
        "set-cookie": [
          res.headers.get("set-cookie").split(",").slice(0, 2).join(""),
          cookie.serialize("token", jwt_token, {
            httpOnly: true,
            maxAge: tokenExpiry,
            sameSite: "none",
            secure: true,
            path: "/",
            expires: addSeconds(new Date(), tokenExpiry),
          }),
        ],
      },
    };
  } catch (e) {
    console.log("Login error", e);
    return {
      body: { message: "Login failed" },
      status: 500,
    };
  }
}
