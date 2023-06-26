import { writable } from "svelte/store";
import { browser } from "$app/env";

const btc = import.meta.env.VITE_BTC;

const persisted = (k, i) => {
  if (
    browser &&
    window.location === window.parent.location &&
    sessionStorage.getItem(k) &&
    sessionStorage.getItem(k) !== "undefined"
  ) {
    try {
      i = JSON.parse(sessionStorage.getItem(k));
    } catch (e) {}
  }

  let s = writable(i);
  s.subscribe((v) => browser && 
      window.location === window.parent.location &&
    sessionStorage.setItem(k, JSON.stringify(v)));
  return s;
};

export const art = writable();
export const artworks = writable([]);
export const artworksLimit = writable(10);
export const commentsLimit = writable(10);
export const edition = writable();
export const error = writable();
export const fee = writable(100);
export const fiat = writable("USD");
export const filterCriteria = writable({
  listPrice: false,
  openBid: false,
  ownedByCreator: false,
  hasSold: false,
  isPhysical: false,
  hasRoyalties: false,
  isFavorited: false,
  fromFollowed: false,
  hasOpenAuction: false,
  filterByCurrency: false,
  selectedCurrency: "L-BTC",
});
export const full = writable();
export const loading = writable();
export const loaded = writable({});
export const locked = writable();
export const loggedIn = writable();
export const meta = writable();
export const offset = writable(0);
export const poll = writable([]);
export const prompt = writable();
export const psbt = writable();
export const results = writable([]);
export const show = writable();
export const sighash = writable();
export const snack = writable();
export const sortCriteria = writable("newest");
export const popup = writable();
export const txcache = writable({});
export const user = writable();
export const token = writable();
export const signStatus = writable();
export const acceptStatus = writable();
export const messageUser = writable({});
export const tipUser = writable({});
export const storeMessages = writable([]);
export const unreadMessages = writable([]);
export const bitcoinUnitLocal = writable("");
export const fiatRates = writable({});
export const asset = persisted("asset", { name: "btc", asset: btc });
export const assetCount = persisted("assetCount", 0);
export const assets = persisted("assets", []);
export const confirmed = persisted("confirmed", {});
export const password = persisted("password");
export const unconfirmed = persisted("unconfirmed", {});
export const username = persisted("username");
export const transactions = persisted("transactions", {});
export const txCount = persisted("txCount", 0);
