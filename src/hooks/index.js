import wretch from "wretch";
import { getUser } from "$queries/users";
import decode from "jwt-decode";
import cookie from "cookie";
import { hbp, getQ } from "$lib/api";
import { addSeconds } from "date-fns";

export async function handle({ event, resolve }) {
  let {
    request: { headers },
    url: { pathname },
  } = event;

  const cookies = cookie.parse(headers.get("cookie") || "");
  let { refresh_token, token: jwt } = cookies;

  let user, setCookie;

  try {
    decode(jwt);
  } catch (e) {
    try {
      if (refresh_token) {
        let res = await hbp
          .headers({ cookie: `refresh_token=${refresh_token}` })
          .url("/auth/token/refresh")
          .get()
          .res();

        let body = await res.json();

        let { jwt_token, jwt_expires_in } = body;
        jwt = jwt_token;

        let tokenExpiry = parseInt(jwt_expires_in / 1000);

        setCookie = [
          res.headers.get("set-cookie").split(",").slice(0, 2).join(""),
          cookie.serialize("token", jwt_token, {
            httpOnly: true,
            maxAge: tokenExpiry,
            sameSite: "none",
            secure: true,
            path: "/",
            expires: addSeconds(new Date(), tokenExpiry),
          }),
        ];
      }
    } catch (e) {
      setCookie = [
        cookie.serialize("refresh_token", "", {
          path: "/",
          expires: new Date(0),
        }),
      ];
    }
  }

  let q = jwt ? getQ({ authorization: `Bearer ${jwt}` }) : getQ();
  event.locals = { jwt, q };

  if (jwt) {
    try {
      let { currentuser } = await q(getUser);
      user = currentuser[0];
    } catch (e) {
      // console.log(e);
    }
  }

  event.locals.user = user;

  const response = await resolve(event);

  if (setCookie && pathname !== "/auth/login")
    response.headers.set("set-cookie", setCookie);

  return response;
}

export const getSession = ({ locals: { jwt, user } }) => {
  return { jwt, user };
};
