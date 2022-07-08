import redis from "./redis.js";
import { electrs } from "./api.js";

export const getUtxos = async (address) => {
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
    if (txns.length) await redis.set(address, txns[0]);
    txns.reverse();

    while (txns.length) {
      let hex = await getHex(txns[0]);
      let tx = Transaction.fromHex(hex);

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

      for (let j = 0; j < outs.length; j++) {
        let { script, value, asset } = outs[j];
        let txid = tx.getId();

        try {
          if (Address.fromOutputScript(script, network) === address) {
            await redis.sAdd(utxoSet, `${txid}:${j}`);
            await redis.set(
              `${txid}:${j}`,
              `${parseAsset(asset)},${parseVal(value)}`
            );
          }
        } catch (e) {}
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

  return utxos;
}
