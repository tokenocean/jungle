import { coinos } from "./api.js";
import { networks } from "liquidjs-lib";
import { app } from "./app.js";
import { auth } from "./auth.js";

let network;
if (process.env.LIQUID_ELECTRS_URL.includes("blockstream")) {
  network = networks.liquid;
} else {
  network = networks.regtest;
}

const btc = network.assetHash;
const fee = 100;

app.post("/bitcoin", auth, async (req, res) => {
  let network = "bitcoin";
  let { liquidAddress, amount } = req.body;

  amount += fee;

  let { address } = await coinos
    .url("/invoice")
    .post({
      liquidAddress,
      invoice: {
        network,
        amount,
      },
    })
    .json();

  return { address, fee };
});

app.post("/liquid", auth, async (req, res) => {
  let network = "liquid";
  let { liquidAddress, amount } = req.body;

  amount += fee;

  let { address } = await coinos
    .url("/invoice")
    .post({
      liquidAddress,
      invoice: {
        network,
        amount,
      },
    })
    .json();

  return { address, fee };
});

app.post("/lightning", auth, async (req, res) => {
  let { liquidAddress, amount } = req.body;

  let { text: address } = await coinos
    .url("/invoice")
    .post({
      liquidAddress,
      invoice: {
        network: "lightning",
        amount: 0,
      },
    })
    .json();

  res.send({ address, fee });
});
