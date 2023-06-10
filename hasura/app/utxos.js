import redis from "./redis.js";
import { electrs, q, lq } from "./api.js";
import {
  blocktime,
  broadcast,
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
import { getUser, wait } from "./utils.js";
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

let locked = {};
export const utxos = async (address) => {
  await wait(() => !locked[address]);

  try {
    locked[address] = true;
    let utxoSet = `${address}:utxos`;
    let last = await redis.lRange(`${address}`, -50, -1);

    let curr = await electrs.url(`/address/${address}/txs`).get().json();
    let txns = [
      ...curr.filter((tx) => !tx.status.confirmed).reverse(),
      ...curr.filter((tx) => tx.status.confirmed),
    ].map((tx) => tx.txid);

    while (curr.length >= 25 && curr.find((tx) => !last.includes(tx.txid))) {
      let prev = txns.at(-1);
      curr = await electrs
        .url(`/address/${address}/txs/chain/${prev}`)
        .get()
        .json();
      txns = [...txns, ...curr.map((tx) => tx.txid)];
    }

    txns = txns.filter((txid) => !last.includes(txid));

    await redis.del(address);
    let latest = [...txns, ...last].slice(0, 50);
    if (latest.length) await redis.rPush(address, latest);

    last = await redis.lRange(`${address}`, -50, -1);

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
            defer = true;
            txns.splice(k, 1);
            txns.unshift(txid);
            break;
          } else {
            skip[j] = true;
          }
        }
      }

      if (defer) continue;

      for (let j = 0; j < ins.length; j++) {
        if (skip[j]) continue;
        let { hash, index } = ins[j];
        let txid = reverse(hash).toString("hex");
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
            await redis.sAdd(utxoSet, `${txid}:${j}`);
            await redis.set(`${txid}:${j}`, `${asset},${value}`);

            if (!added[asset]) {
              added[asset] = true;
              redis.rPush(`${address}:${asset}`, txid);
            }
          }
        } catch (e) {
          continue;
        }
      }

      txns.shift();
    }

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

    delete locked[address];
    return utxos;
  } catch (e) {
    console.log(e);
    delete locked[address];
    return [];
  }
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
  try {
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
  } catch (e) {
    console.log("problem getting assets", e);
    res.code(500).send(e.message);
  }
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
  let { txid } = req.params;
  try {
    res.send(await hex(txid));
  } catch (e) {
    console.log("problem getting tx hex", txid, req.headers["cf-connecting-ip"]);
    res.code(500).send(e.message);
  }
});

app.get("/:username/:asset/transactions/count", auth, async (req, res) => {
  try {
    let { asset, username } = req.params;
    res.send({ count: await redis.lLen(`${username}:${asset}`) });
  } catch (e) {
    console.log("problem getting tx count", e);
    res.code(500).send(e.message);
  }
});

app.get("/:username/:asset/transactions/:page", async (req, res) => {
  try {
    let { asset, page, username } = req.params;
    let { users } = await q(getUserByUsername, { username });

    if (!users.length) throw new Error("user not found");
    let { id: user_id, address, multisig } = users[0];

    let totalCount = await redis.lLen(`${username}:${asset}`);
    let addressCount = await redis.lLen(`${address}:${asset}`);
    let multisigCount = await redis.lLen(`${multisig}:${asset}`);

    let last;
    let i = totalCount;
    while (i > 0 && !last) {
      last = await blocktime(await redis.lIndex(`${username}:${asset}`, --i));
    }

    let unseen = [];

    let latest = [];
    for (let i = 0; i < totalCount; i++) {
      let txid = await redis.lIndex(`${username}:${asset}`, i);
      let time = await blocktime(txid);
      if (!time || time === last) latest.push(txid);
    }

    let findUnseen = async (a, c) => {
      for (let i = c - 1; i >= 0; i--) {
        let txid = await redis.lIndex(`${a}:${asset}`, i);
        let time = await blocktime(txid);
        if (last && time < last) break;
        if (!latest.includes(txid)) {
          unseen.push({ txid, time });
          totalCount++;
        }
      }
    };

    await findUnseen(address, addressCount);
    await findUnseen(multisig, multisigCount);

    unseen = unseen.sort((a, b) => (b.time ? a.time - b.time : -1));
    for (let i = 0; i < unseen.length; i++) {
      await redis.rPush(`${username}:${asset}`, unseen[i].txid);
    }

    let offset = 25;
    let txids = (
      await redis.lRange(
        `${username}:${asset}`,
        -(page * offset),
        0 - ((page - 1) * offset + 1)
      )
    ).reverse();

    let transactions = [];
    let { transactions: existing } = await q(getTransactionsByTxid, {
      txids,
      asset,
    });

    let our = (out) =>
      out.asset === asset && [address, multisig].includes(out.address);

    for (let i = 0; i < txids.length; i++) {
      let txid = txids[i];

      let tx = Transaction.fromHex(await hex(txid));
      let amount = 0;

      for (let j = 0; j < tx.ins.length; j++) {
        let { hash, index } = tx.ins[j];
        let txid = reverse(hash).toString("hex");
        let out = Transaction.fromHex(await hex(txid)).outs[index];

        try {
          out = {
            asset: parseAsset(out.asset),
            address: Address.fromOutputScript(out.script, network),
            value: parseVal(out.value),
          };

          if (our(out)) amount -= out.value;
        } catch (e) {
          continue;
        }
      }

      for (let j = 0; j < tx.outs.length; j++) {
        let out = tx.outs[j];

        try {
          out = {
            asset: parseAsset(out.asset),
            address: Address.fromOutputScript(out.script, network),
            value: parseVal(out.value),
          };

          if (our(out)) amount += out.value;
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
        let time = await blocktime(txid);
        created_at = formatISO(time ? new Date(1000 * time) : new Date());
        confirmed = !!time;
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

app.post("/broadcast", async (req, res) => {
  let { hex } = req.body;

  try {
    res.send({ txid: await lq.sendRawTransaction(hex) });
  } catch (e) {
    console.log("problem broadcasting transaction", e);
    res.code(500).send(e.message);
  }
});
