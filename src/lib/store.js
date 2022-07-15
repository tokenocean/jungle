import { writable } from "svelte/store";
import { browser } from "$app/env";


const btc = import.meta.env.VITE_BTC;

const persisted = (k, i) => {
  let s = writable(
    browser && localStorage.getItem(k) ? JSON.parse(localStorage.getItem(k)) : i
  );

  s.subscribe((v) => browser && localStorage.setItem(k, JSON.stringify(v)));

  return s;
};

export const art = writable();
export const artworks = writable([]);
export const artworksLimit = writable(10);
export const commentsLimit = writable(10);
export const edition = writable();
export const error = writable();
export const fee = writable(100);
export const filterCriteria = writable({
  listPrice: false,
  openBid: false,
  ownedByCreator: false,
  hasSold: false,
  isPhysical: false,
  hasRoyalties: false,
  isFavorited: false,
  fromFollowed: false,
});
export const full = writable();
export const loading = writable();
export const loaded = writable({});
export const locked = writable();
export const loggedIn = writable();
export const meta = writable();
export const offset = writable(0);
export const password = writable();
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
export const transactions = writable([]);
export const user = writable();
export const token = writable();
export const wallet = writable();
export const signStatus = writable();
export const acceptStatus = writable();
export const messageUser = writable({});
export const tipUser = writable({});
export const storeMessages = writable([]);
export const unreadMessages = writable([]);
export const bitcoinUnitLocal = writable("");

export const asset = persisted("asset", { name: "btc", asset: btc });
export const count = persisted("count", 0);
export const assets = persisted("assets", []);
export const confirmed = persisted("confirmed", {});
export const unconfirmed = persisted("unconfirmed", {});
