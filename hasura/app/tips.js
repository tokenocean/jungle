import { app } from "./app.js";
import { auth } from "./auth.js";
import { getUser } from "./utils.js";
import { btc } from "./wallet.js";
import { Psbt } from "liquidjs-lib";
import { createTransaction } from "./queries.js";
import { q } from "./api.js";

app.post("/tip", auth, async (req, res) => {
  try {
    let { amount, psbt } = req.body;

    let user = await getUser(req);

    let transaction = {
      amount,
      asset: btc,
      hash: Psbt.fromBase64(psbt).extractTransaction().getId(),
      user_id: user.id,
      psbt,
      type: "tip",
    };

    await q(createTransaction, { transaction });

    res.send({ ok: true });
  } catch (e) {
    console.log(e);
    res.code(500).send(e.message);
  }
});
