import { getTx } from "$lib/wallet";
import { getTransaction } from "$queries/transactions.js";
import { Psbt } from "liquidjs-lib";

export async function get({ request: { headers }, locals: { q }, params }) {
  let { id } = params;

  try {
    let {
      transactions_by_pk: { hash, psbt },
    } = await q(getTransaction, { id });

    if (!psbt) {
      let tx = await getTx(hash);

      p = new Psbt();
      for (let i = 0; i < tx.ins.length; i++) {
        p.addInput(tx.ins[i]);
      }

      tx.outs.map((output) => {
        p.addOutput(output);
      });

      psbt = p.toBase64();
    }

    return {
      body: { hash, psbt },
    };
  } catch (e) {
    console.log(e);
    return {
      body: { message: "Problem getting transaction" },
      status: 500,
    };
  }
}
