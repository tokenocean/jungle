import toBuffer from "blob-to-buffer";
import { formatISO } from "date-fns";
import fs from "fs";
import path from "path";
import "make-promises-safe";

import { app } from "./app.js";

import "./auth.js";
import "./artworks.js";
import "./auctions.js";
import "./coinos.js";
import "./proxy.js";
import "./messages.js";
import "./monitor.js";
import "./registry.js";
import "./signing.js";
 import "./upload.js";
import "./mail.js";
import "./tips.js";
import "./utxos.js";

app.listen(process.env.PORT || 8091, "0.0.0.0", function (err, address) {
  if (err) {
    console.log(err);
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});
