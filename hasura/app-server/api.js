const wretch = require("wretch");
const fetch = require("node-fetch");
wretch().polyfills({ fetch });
const { AMP_TOKEN, HASURA_SECRET, HASURA_URL } = process.env;

const amp = wretch()
  .url("https://amp-beta.blockstream.com/api")
  .headers({ authorization: `token ${AMP_TOKEN}` });

const api = wretch()
  .url(HASURA_URL)
  .headers({ "x-hasura-admin-secret": HASURA_SECRET });

const electrs = wretch().url("http://electrs-liquid:3002");

module.exports = { amp, api, electrs };
