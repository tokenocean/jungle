import { api, q } from "./api.js";
import { formatISO, compareAsc, parseISO } from "date-fns";
import { combine, release, sign, broadcast } from "./wallet.js";
import { check } from "./signing.js";
import { cancelBids, getFinishedAuctions, releaseToken } from "./queries.js";

let checkAuctions = async () => {
  try {
    let { auctions } = await q(getFinishedAuctions, {
      now: formatISO(new Date()),
    });

    for (let i = 0; i < auctions.length; i++) {
      let auction = auctions[i];
      let { edition } = auction;
      let { bid } = edition;

      await q(closeAuction, {
        id: artwork.id,
        artwork: {
          auction_start: null,
          auction_end: null,
        },
      });

      console.log("finalizing auction for", artwork.slug);
      console.log("reserve price", artwork.reserve_price);

      try {
        if (
          !(bid && bid.psbt) ||
          compareAsc(parseISO(bid.created_at), parseISO(auction.auction_end)) >
            0 ||
          bid.amount < auction.reserve
        )
          throw new Error("no bid");

        let combined = combine(auction.psbt, bid.psbt);

        await check(combined);

        let psbt = await sign(combined);

        await broadcast(psbt);

        await q(releaseToken, {
          id: edition.id,
          owner_id: bid.user.id,
          amount: bid.amount,
          hash: psbt.extractTransaction().getId(),
          psbt: psbt.toBase64(),
          asset: edition.asking_asset,
          bid_id: bid.id,
          type: "release",
        });

        console.log("released to high bidder");
      } catch (e) {
        console.log("couldn't release to bidder,", e.message);

        try {
          await q(cancelBids, {
            artwork_id: artwork.id,
            start: artwork.auction_start,
            end: artwork.auction_end,
          });
        } catch (e) {
          console.log("problem cancelling bids", e);
        }

        if (edition.has_royalty) continue;

        let psbt;
        try {
          psbt = await sign(artwork.auction_release_tx);
          await broadcast(psbt);

          console.log("released to current owner");

          await q(releaseToken, {
            id: artwork.id,
            owner_id: artwork.owner.id,
            amount: 0,
            hash: psbt.extractTransaction().getId(),
            psbt: psbt.toBase64(),
            asset: artwork.asking_asset,
            type: "return",
          });
        } catch (e) {
          console.log("problem releasing", psbt.toBase64(), e);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }

  setTimeout(checkAuctions, 2000);
};

checkAuctions();
