import redis from "./redis.js";
import { electrs, q } from "./api.js";
import { compareAsc, parseISO, subMinutes } from "date-fns";
import { getCurrentUser, getLastTransaction, getUser as getUserQuery } from "./queries.js";
import reverse from "buffer-reverse";

export const kebab = (str) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join("-");

export const sleep = (n) => new Promise((r) => setTimeout(r, n));

export const wait = async (f, s = 300) => {
  let i = 0;
  while (!(await f()) && i < s) (await sleep(1000)) && i++;
  if (i >= s) throw new Error("timeout");
  return f();
};

export const getUtxosFromRedis = async (address) => {
  const utxoSet = `${address}:utxos`;
  const set = await redis.sMembers(utxoSet);

  const utxos = [];
  for (let i = 0; i < set.length; i++) {
    const utxo = set[i];
    const [txid, vout] = utxo.split(":");
    const [asset, value] = (await redis.get(utxo)).split(",");

    utxos.push({ txid, vout: parseInt(vout), asset, value: parseInt(value) });
  }

  return utxos;
};

export const getUser = async ({ headers }) => {
  if (!headers.authorization) throw new Error("missing auth token");
  const { currentuser } = await q(getCurrentUser, null, headers);
  return currentuser[0];
};

export const getUserById = async (id) => {
  const { users_by_pk: user } = id
    ? await q(getUserQuery, { id })
    : { users_by_pk: null };

  return user;
};

export const isSpent = async ({ ins }, artwork_id) => {
  try {
    const { transactions } = await q(getLastTransaction, { artwork_id });

    if (
      !transactions.length ||
      compareAsc(
        parseISO(transactions[0].created_at),
        subMinutes(new Date(), 2)
      ) > 0
    ) {
      return false;
    }

    for (let i = 0; i < ins.length; i++) {
      const { index, hash } = ins[i];
      const txid = reverse(hash).toString("hex");

      const { spent } = await electrs
        .url(`/tx/${txid}/outspend/${index}`)
        .get()
        .json();

      if (spent) {
        return true;
      }
    }

    return false;
  } catch (e) {
    console.log("problem checking spent status", e);
    return false;
  }
};
