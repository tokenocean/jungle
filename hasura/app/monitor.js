import { api, ipfs, q, electrs, registry } from "./api.js";
import { formatISO } from "date-fns";
import fs from "fs";
import { address as Address, Psbt, Transaction } from "liquidjs-lib";
const sleep = (n) => new Promise((r) => setTimeout(r, n));
import {
  btc,
  blocktime,
  hex,
  network,
  parseAsset,
  parseVal,
} from "./wallet.js";
import { app } from "./app.js";
import { auth } from "./auth.js";
import { getUser, wait, isSpent } from "./utils.js";
import redis from "./redis.js";

import {
  cancelBid,
  cancelListing,
  createTransaction,
  createUtxo,
  deleteUtxo,
  getActiveBids,
  getActiveListings,
  getAvatars,
  getContract,
  getCurrentUser,
  getTransactions,
  getUserByAddress,
  getUnconfirmed,
  getUtxos,
  setConfirmed,
  setOwner,
  setTransactionTime,
  updateUser,
} from "./queries.js";

const txcache = {};
const hexcache = {};

const updateAvatars = async () => {
  fs.readdir("/export", async (err, files) => {
    try {
      let { users } = await q(getAvatars);

      users.map((user) => {
        let f = files.find((f) => f.startsWith(user.avatar_url));
        if (f && f !== user.avatar_url) {
          user.avatar_url = f;

          q(updateUser, { user, id: user.id }).catch(console.log);
        }
      });
    } catch (e) {
      console.log(e);
    }
  });
};

app.post("/updateAvatars", async (req, res) => {
  if (req.headers["x-hasura-admin"] !== process.env.HASURA_SECRET)
    return res.code(401).send("unauthorized");

  try {
    await updateAvatars();
    res.send({ ok: true });
  } catch (e) {
    console.log(e);
  }
});

const checkBids = async () => {
  try {
    let { activebids } = await q(getActiveBids);

    for (let i = 0; i < activebids.length; i++) {
      let tx = activebids[i];

      await sleep(1000);
      let p = Psbt.fromBase64(tx.psbt);
      try {
        if (await isSpent(p.data.globalMap.unsignedTx.tx, tx.artwork_id))
          await q(cancelBid, { id: tx.id });
      } catch (e) {
        // keep going
      }
    }
  } catch (e) {
    console.log("problem checking bids", e);
  }

  setTimeout(checkBids, 5000);
};
setTimeout(checkBids, 2000);

const checkListings = async () => {
  try {
    let { activelistings } = await q(getActiveListings);
    for (let i = 0; i < activelistings.length; i++) {
      let tx = activelistings[i];
      let p = Psbt.fromBase64(tx.psbt);
      try {
        if (await isSpent(p.data.globalMap.unsignedTx.tx, tx.artwork_id))
          await q(cancelListing, { id: tx.id, artwork_id: tx.artwork_id });
      } catch (e) {
        // keep going;
      }
    }
  } catch (e) {
    console.log("problem checking listings", e);
  }

  setTimeout(checkListings, 5000);
};
// setTimeout(checkListings, 4000);

const checkTransactions = async () => {
  try {
    let { transactions } = await q(getUnconfirmed);

    for (let i = 0; i < transactions.length; i++) {
      let tx = transactions[i];
      let time;

      try {
        time = await blocktime(tx.hash);
      } catch (e) {
        continue;
      }

      if (time) {
        let {
          update_transactions_by_pk: { artwork_id, type, bid },
        } = await q(setConfirmed, {
          id: tx.id,
        });

        if (["deposit", "withdrawal"].includes(type))
          await q(setTransactionTime, {
            id: tx.id,
            created_at: formatISO(new Date(1000 * time)),
          });

        if (type === "accept")
          await q(setOwner, { id: artwork_id, owner_id: bid.user_id });
      }
    }
  } catch (e) {
    console.log("problem checking transactions", e);
  }

  setTimeout(checkTransactions, 5000);
};

setTimeout(checkTransactions, 8000);
