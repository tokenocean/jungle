import cookie from "cookie";
import { hbp } from "$lib/api";
import { addSeconds } from "date-fns";
import { getUser } from "$queries/users";

const opts = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
};

export async function GET({ request: { headers, url }, locals: { q } }) {
  try {
    const cookies = cookie.parse(headers.get("cookie") || "");
    let { refresh_token, token: jwt } = cookies;

    if (!refresh_token) throw new Error("no refresh token");

    let body = await hbp
      .url(`/auth/token/refresh?refresh_token=${refresh_token}`)
      .get()
      .json();
    let { jwt_token, jwt_expires_in } = body;
    ({ refresh_token } = body);
    let tokenExpiry = parseInt(jwt_expires_in / 1000);
    let refreshExpiry = parseInt(259200);
    let { currentuser } = await q(getUser);
    body.currentuser = currentuser[0];

    return {
      body,
      headers: {
        "set-cookie": [
          cookie.serialize("refresh_token", refresh_token, {
            ...opts,
            maxAge: refreshExpiry,
            expires: addSeconds(new Date(), refreshExpiry),
          }),
          cookie.serialize("token", jwt_token, {
            ...opts,
            maxAge: tokenExpiry,
            expires: addSeconds(new Date(), tokenExpiry),
          }),
        ],
      },
    };
  } catch (error) {
    console.log(error)
    return {
      status: 500,
      error,
      headers: new Headers({
        "set-cookie": [
          cookie.serialize("token", "", {
            ...opts,
            expires: new Date(0),
          }),
          cookie.serialize("refresh_token", "", {
            ...opts,
            expires: new Date(0),
          }),
        ].join(","),
      }),
    };
  }
}
