import cookie from "cookie";

const opts = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  path: "/",
};

export async function GET({ request: { headers } }) {
  return {
    status: 302,
    headers: {
      location: "/logout/done",
      "set-cookie": [
        cookie.serialize("token", "", {
          ...opts,
          expires: new Date(0),
        }),
        cookie.serialize("refresh_token", "", {
          ...opts,
          expires: new Date(0),
        }),
      ],
    },
  };
}
