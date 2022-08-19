import { q } from "./api.js";
import { getCurrentUser, getUser as getUserQuery } from "./queries.js";

export const kebab = (str) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join("-");

export const sleep = (n) => new Promise((r) => setTimeout(r, n));

export const wait = async (f, s = 300) => {
  let i = 0;
  while (!(await f()) && i < s) await sleep(1000) && i++;
  if (i >= s) throw new Error("timeout");
  return f();
};

export const getUser = async ({ headers }) => {
  if (!headers.authorization) throw new Error("missing auth token");
  let { currentuser } = await q(getCurrentUser, null, headers);
  return currentuser[0];
};

export const getUserById = async (id) => {
  let { users_by_pk: user } = id
    ? await q(getUserQuery, { id })
    : { users_by_pk: null };

  return user;
};
