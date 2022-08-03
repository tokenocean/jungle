import redis from "./redis.js";
import { electrs, q } from "./api.js";
import {
  blocktime,
  btc,
  hex,
  network,
  parseAsset,
  parseVal,
} from "./wallet.js";
import { address as Address, Transaction } from "liquidjs-lib";
import reverse from "buffer-reverse";
import { app } from "./app.js";
import { auth } from "./auth.js";
import { getUser } from "./utils.js";
import {
  createTransaction,
  getAssetArtworks,
  getTransactionsByTxid,
  getUserByUsername,
} from "./queries.js";
import { compareDesc, parseISO, formatISO } from "date-fns";

let balances = async (address, asset) => {
  let mempool = (
    await electrs.url(`/address/${address}/txs/mempool`).get().json()
  ).map((tx) => tx.txid);

  let confirmed = [],
    unconfirmed = [];

  let balances = {};
  (await utxos(address))
    .filter((tx) => !asset || tx.asset === asset)
    .map((tx) =>
      mempool.includes(tx.txid) ? unconfirmed.push(tx) : confirmed.push(tx)
    );

  let sum = (a, b) => ({ ...a, [b.asset]: (a[b.asset] || 0) + b.value });
  confirmed = confirmed.reduce(sum, {});
  unconfirmed = unconfirmed.reduce(sum, {});

  return { confirmed, unconfirmed };
};

export const utxos = async (address) => {
  let utxoSet = `${address}:utxos`;
  let last = await redis.get(address);

  let curr = await electrs.url(`/address/${address}/txs`).get().json();
  let txns = [
    ...curr.filter((tx) => !tx.status.confirmed).reverse(),
    ...curr.filter((tx) => tx.status.confirmed),
  ].map((tx) => tx.txid);

  while (curr.length >= 25 && !txns.includes(last)) {
    let prev = txns.at(-1);
    curr = await electrs
      .url(`/address/${address}/txs/chain/${prev}`)
      .get()
      .json();
    txns = [...txns, ...curr.map((tx) => tx.txid)];
  }

  let index = txns.indexOf(last);
  if (index > -1) txns = txns.slice(0, index);
  txns.reverse();

  while (txns.length) {
    let tx = Transaction.fromHex(await hex(txns[0]));

    let { ins, outs } = tx;
    let defer;
    let skip = {};

    for (let j = 0; j < ins.length; j++) {
      let { hash, index } = ins[j];
      let txid = reverse(hash).toString("hex");
      if (!(await redis.sIsMember(utxoSet, `${txid}:${index}`))) {
        let k = txns.indexOf(txid);
        if (k > -1) {
          console.log("DEFERRING", txid);
          defer = true;
          txns.splice(k, 1);
          txns.unshift(txid);
          break;
        } else {
          console.log("SKIPPING", txid);
          skip[j] = true;
        }
      }
    }

    if (defer) continue;

    // await redis.rPush(`${address}:txns`, tx.getId());

    for (let j = 0; j < ins.length; j++) {
      if (skip[j]) continue;
      let { hash, index } = ins[j];
      let txid = reverse(hash).toString("hex");
      console.log("REMOVING", txid, index);
      await redis.sRem(utxoSet, `${txid}:${index}`);
    }

    let added = {};

    for (let j = 0; j < outs.length; j++) {
      let { script, value, asset } = outs[j];
      let txid = tx.getId();
      asset = parseAsset(asset);
      value = parseVal(value);

      try {
        if (Address.fromOutputScript(script, network) === address) {
          console.log("ADDING", txid, j);
          await redis.sAdd(utxoSet, `${txid}:${j}`);
          await redis.set(`${txid}:${j}`, `${asset},${value}`);

          if (!added[asset]) {
            console.log("ADDED TO LIST", address, asset);
            added[asset] = true;
            redis.rPush(`${address}:${asset}`, txid);
          }
        }
      } catch (e) {
        continue;
      }
    }

    last = txns.shift();
  }

  await redis.set(address, last);

  let utxos = [];
  let set = await redis.sMembers(utxoSet);

  for (let i = 0; i < set.length; i++) {
    let utxo = set[i];
    let [txid, vout] = utxo.split(":");
    let [asset, value] = (await redis.get(utxo)).split(",");

    vout = parseInt(vout);
    value = parseInt(value);

    utxos.push({ txid, vout, asset, value });
  }

  return utxos;
};

app.get("/assets/count", auth, async (req, res) => {
  let { address, multisig } = await getUser(req);

  let a = await balances(address);
  let b = await balances(multisig);
  let c = {};

  ["confirmed", "unconfirmed"].map((v) =>
    Object.keys(b[v]).map((k) =>
      a[v][k] ? (a[v][k] += b[v][k]) : (a[v][k] = b[v][k])
    )
  );

  res.send(
    [...new Set([...Object.keys(a.confirmed), ...Object.keys(a.unconfirmed)])]
      .length
  );
});

app.get("/asset/:asset", async (req, res) => {
  let { asset } = req.params;

  let title = await redis.get(asset);

  if (!title) {
    let { artworks } = await q(getAssetArtworks, {
      assets: [asset],
    });

    let art;
    if (artworks.length === 1) art = artworks[0];
    title = art ? art.title : asset.substr(0, 6);
    await redis.set(asset, title);
  }

  res.send({ asset, name: title });
});

app.get("/assets/:page", auth, async (req, res) => {
  let { page } = req.params;
  let offset = 25;
  page--;

  let { address, multisig } = await getUser(req);

  let a = await balances(address);
  let b = await balances(multisig);

  ["confirmed", "unconfirmed"].map((v) =>
    Object.keys(b[v]).map((k) =>
      a[v][k] ? (a[v][k] += b[v][k]) : (a[v][k] = b[v][k])
    )
  );

  let assets = [
    ...new Set([...Object.keys(a.confirmed), ...Object.keys(a.unconfirmed)]),
  ];

  let titles = {};
  let unrecognized = [];
  for (let i = 0; i < assets.length; i++) {
    let asset = assets[i];

    titles[asset] = await redis.get(asset);
    if (!titles[asset]) unrecognized.push(asset);
  }

  let { artworks } = await q(getAssetArtworks, {
    assets: unrecognized,
  });

  for (let i = 0; i < unrecognized.length; i++) {
    let asset = unrecognized[i];
    let art = artworks.find((a) => a.asset === asset);
    titles[asset] =
      asset === btc ? "L-BTC" : art ? art.title : asset.substr(0, 6);
    await redis.set(asset, titles[asset]);
  }

  assets = Object.keys(titles)
    .map((asset) => ({ asset, name: titles[asset] }))
    .sort((a, b) => a.name.localeCompare(b.name))
    .sort((a, b) => (a.name === "L-BTC" ? -1 : 1));

  let result = assets.slice(page * offset, page * offset + offset);
  res.send(result);
});

app.get("/:address/:asset/balance", async (req, res) => {
  try {
    let { address, asset } = req.params;
    let { confirmed, unconfirmed } = await balances(address);

    res.send({ confirmed, unconfirmed });
  } catch (e) {
    console.log("problem getting address balance", e);
    res.code(500).send(e.message);
  }
});

app.get("/:asset/balance", auth, async (req, res) => {
  try {
    let { asset } = req.params;

    let { address, multisig } = await getUser(req);

    let a = await balances(address, asset);
    let b = await balances(multisig, asset);

    ["confirmed", "unconfirmed"].map((v) =>
      Object.keys(b[v]).map((k) =>
        a[v][k] ? (a[v][k] += b[v][k]) : (a[v][k] = b[v][k])
      )
    );

    res.send(a);
  } catch (e) {
    console.log("problem getting balances", e);
    res.code(500).send(e.message);
  }
});

app.get("/address/:address/utxo", async (req, res) => {
  try {
    res.send(await utxos(req.params.address));
  } catch (e) {
    console.log("problem getting utxos", e);
    res.code(500).send(e.message);
  }
});

app.get("/address/:address/:asset/utxo", async (req, res) => {
  try {
    let { asset, address } = req.params;
    res.send((await utxos(address)).filter((tx) => tx.asset === asset));
  } catch (e) {
    console.log("problem getting utxos", e);
    res.code(500).send(e.message);
  }
});

app.get("/tx/:txid/hex", async (req, res) => {
  try {
    let { txid } = req.params;
    console.log("TXID", txid, await hex(txid));
    res.send(await hex(txid));
  } catch (e) {
    console.log("problem getting tx hex", e);
    res.code(500).send(e.message);
  }
});

app.get("/:username/:asset/transactions/:page", async (req, res) => {
  try {
    let { asset, page, username } = req.params;
    let { users } = await q(getUserByUsername, { username });

    if (!users.length) throw new Error("user not found");
    let { id: user_id, address, multisig } = users[0];

    let totalCount = await redis.lLen(username);
    console.log("TOTAL", totalCount);

    let addressCount = await redis.lLen(`${address}:${asset}`);
    let multisigCount = await redis.lLen(`${multisig}:${asset}`);
    console.log("addressCount", addressCount);
    console.log("multisigCount", multisigCount);

    if (totalCount < addressCount + multisigCount) {
      let last = await blocktime(await redis.lIndex(username, 0));
      console.log("LAST", last)

      for (let i = 0; i < addressCount; i++) {
        let txid = await redis.lIndex(`${address}:${asset}`, i);
        if ((await blocktime(txid)) <= last) break;
        console.log("PUSHING")
        await redis.lPush(username, txid);
      }

      for (let i = 0; i < multisigCount; i++) {
        let txid = await redis.lIndex(`${multisig}:${asset}`, i);
        if ((await blocktime(txid)) <= last) break;
        await redis.lPush(username, txid);
      }
    }

    totalCount = await redis.lLen(username);
    console.log("TOTAL", totalCount);

    let offset = 25;
    let get = (a) =>
      redis.lRange(
        `${a}:${asset}`,
        -(page * offset),
        0 - ((page - 1) * offset + 1)
      );

    let txids = [...(await get(address)), ...(await get(multisig))]
      .sort((a, b) =>
        compareDesc(parseISO(a.created_at), parseISO(b.created_at))
      )
      .slice(0, offset);

    let transactions = [];
    let { transactions: existing } = await q(getTransactionsByTxid, {
      txids,
      asset,
    });

    for (let i = 0; i < txids.length; i++) {
      let txid = txids[i];

      let tx = Transaction.fromHex(await hex(txid));
      let amount = 0;

      for (let j = 0; j < tx.ins.length; j++) {
        let { hash, index } = tx.ins[j];
        let txid = reverse(hash).toString("hex");
        let out = Transaction.fromHex(await hex(txid)).outs[index];

        out = {
          asset: parseAsset(out.asset),
          address: Address.fromOutputScript(out.script, network),
          value: parseVal(out.value),
        };

        if (out.asset === asset && out.address === address) amount -= out.value;
      }

      for (let j = 0; j < tx.outs.length; j++) {
        let out = tx.outs[j];

        try {
          out = {
            asset: parseAsset(out.asset),
            address: Address.fromOutputScript(out.script, network),
            value: parseVal(out.value),
          };

          if (out.asset === asset && out.address === address)
            amount += out.value;
        } catch (e) {
          continue;
        }
      }

      let id, created_at, type, confirmed, artwork_id;

      let candidates = existing.filter(
        (tx) => tx.hash === txid && tx.address === address
      );

      if (candidates.length) {
        ({ id, confirmed, created_at, type } =
          candidates.length > 1
            ? candidates.find(
                (tx) => !["deposit", "withdrawal"].includes(tx.type)
              )
            : candidates[0]);
      }

      if (!type) {
        type = amount > 0 ? "deposit" : "withdrawal";
      }

      if (!created_at || !confirmed) {
        let status = await electrs.url(`/tx/${txid}/status`).get().json();

        let { block_time } = status;

        created_at = formatISO(
          block_time ? new Date(1000 * block_time) : new Date()
        );

        confirmed = status.confirmed;
      }

      let transaction = {
        id,
        user_id,
        hash: txid,
        amount,
        created_at,
        type,
        confirmed,
        artwork_id,
      };

      // if (!id) await q(createTransaction, { transaction });

      transactions.push(transaction);
    }

    res.send(transactions);
  } catch (e) {
    console.log("problem getting transactions", e);
  }
});
