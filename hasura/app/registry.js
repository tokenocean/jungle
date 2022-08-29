import fs from "fs";
import { app } from "./app.js";
import { q } from "./api.js";
import { getContract } from "./queries.js";

app.post("/asset/register", async (req, res) => {
  let { asset } = req.body;

  let proofs = {};
  try {
    proofs = require("/export/proofs.json");
  } catch (e) {}

  proofs[asset] = true;
  fs.writeFileSync("/export/proofs.json", JSON.stringify(proofs));

  try {
    let { transactions } = await q(getContract, { asset });
    let { contract } = transactions[0];

    r = await registry
      .post({
        asset_id: asset,
        contract: JSON.parse(contract),
      })
      .json();

    res.send(r);
  } catch (e) {
    res.code(500).send(`Asset registration failed ${e.message}`);
  }
});

app.get("/proof/liquid-asset-proof-:asset", (req, res) => {
  let proofs = {};
  try {
    proofs = JSON.parse(fs.readFileSync("/export/proofs.json"));
  } catch (e) {
    console.log(e);
  }

  let {
    headers: { host },
    params: { asset },
  } = req;

  host = host.replace(/:.*/, "");
  if (proofs[asset])
    res.send(
      `Authorize linking the domain name ${host} to the Liquid asset ${asset}`
    );
  else res.code(500).send("Unrecognized asset");
});

