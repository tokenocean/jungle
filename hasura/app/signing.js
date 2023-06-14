import { q } from "./api.js";
import { keypair, parse, sign } from "./wallet.js";
import { parseISO, isWithinInterval } from "date-fns";
import { address as Address } from "liquidjs-lib";
import { app } from "./app.js";
import { auth } from "./auth.js";
import { getUserByAddress, getArtworks, allMultisig } from "./queries.js";

app.get("/pubkey", async (req, res) => {
  const { pubkey } = keypair();
  res.send({ pubkey: pubkey.toString("hex") });
});

app.get("/address/:address", async (req, res) => {
  const { address } = req.params;
  let { users } = await q(getUserByAddress, { address });
  if (users.length) {
    let { address, multisig } = users[0];
    res.send({ address, multisig });
  } else {
    res.status(500).send("address not found");
  }
});

app.post("/sign", auth, async (req, res) => {
  try {
    const { psbt } = req.body;

    await check(psbt);

    res.send({ base64: sign(psbt).toBase64() });
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
});

export const check = async (psbt) => {
  const [txid, inputs, outputs] = await parse(psbt);

  let multisig = (await q(allMultisig)).users.map((u) => u.multisig);

  let { artworks } = await q(getArtworks, {
    assets: outputs.map((o) => o.asset),
  });

  artworks.map(
    ({
      asset,
      has_royalty,
      royalty_recipients,
      artist,
      owner,
      list_price,
      asking_asset,
      auction_start,
      auction_end,
    }) => {
      let outs = outputs.filter((o) => o.asset === asking_asset);

      let toRoyaltyRecipients = outs
        .filter((o) => {
          const recipientsWithOuts = royalty_recipients.find((recipient) => {
            let unconfidential;
            try {
              unconfidential = Address.fromConfidential(
                recipient.address
              ).unconfidentialAddress;
            } catch (e) {}

            return (
              recipient.address === o.address || unconfidential === o.address
            );
          });
          return !!recipientsWithOuts;
        })
        .reduce((a, b) => (a += b.value), 0);

      let toOwner =
        outs
          .filter(
            (o) => o.address === owner.address || o.address === owner.multisig
          )
          .reduce((a, b) => a + parseInt(b.value), 0) -
        inputs
          .filter(
            (o) =>
              o.asset === asking_asset &&
              (o.address === owner.address || o.address === owner.multisig)
          )
          .reduce((a, b) => a + parseInt(b.value), 0);

      if (auction_end) {
        let start = parseISO(auction_start);
        let end = parseISO(auction_end);

        if (
          toOwner !== list_price &&
          isWithinInterval(new Date(), { start, end })
        )
          throw new Error("Auction underway");
      }

      if (has_royalty) {
        if (toOwner) {
          let amountDue = 0;

          for (let i = 0; i < royalty_recipients.length; i++) {
            const element = royalty_recipients[i];

            amountDue += Math.round((toOwner * element.amount) / 100);
          }

          if (toRoyaltyRecipients < amountDue && artist.id !== owner.id)
            throw new Error("Royalty not paid");
        }

        if (
          outputs.find(
            (o) => o.asset === asset && !multisig.includes(o.address)
          )
        ) {
          throw new Error(
            "Token cannot be transferred to an external address when royalties are activated or auction is underway."
          );
        }
      }
    }
  );
};
