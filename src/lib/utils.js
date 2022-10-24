import { fade as svelteFade } from "svelte/transition";
import { get } from "svelte/store";
import { session } from "$app/stores";
import {
  acceptStatus,
  assets,
  error,
  fiat,
  full,
  prompt,
  snack,
  user,
  bitcoinUnitLocal,
} from "$lib/store";
import { goto as svelteGoto } from "$app/navigation";
import { AcceptPrompt, InsufficientFunds } from "$comp";
import { isWithinInterval, parseISO, compareAsc } from "date-fns";
import { query } from "$lib/api";
import { getArtworkByAsset } from "$queries/artworks";
import { getUserByAddress, updateUser } from "$queries/users";
import * as browserifyCipher from "browserify-cipher";
import * as nobleSecp256k1 from "@noble/secp256k1";
import { browser } from "$app/env";
import { fromBase58 } from "bip32";
import { network } from "$lib/wallet";

export const btc = import.meta.env.VITE_BTC;
export const cad = import.meta.env.VITE_CAD;
export const usd = import.meta.env.VITE_USD;
export const host = import.meta.env.VITE_HOST;
export const label = ({ asset, name }, field = "ticker") =>
  name ||
  (asset ? (tickers[asset] ? tickers[asset][field] : asset.substr(0, 5)) : "");

export const sleep = (n) => new Promise((r) => setTimeout(r, n));

export const fade = (n, o) => svelteFade(n, { ...o, duration: 50 });

export const publicPages = [
  "login",
  "register",
  "activate",
  "forgot-password",
  "reset-password",
  "terms-and-conditions",
  "privacy-policy",
  "activate",
];

export const confirm = async () => {
  acceptStatus.set(false);

  return await new Promise((resolve) =>
    acceptStatus.subscribe((acceptedSub) => {
      acceptedSub ? resolve(acceptedSub) : prompt.set(AcceptPrompt);
    })
  );
};

export const royaltyRecipientSystemType = "system";
export const royaltyRecipientIndividualType = "individual";

export const royaltyRecipientTypes = {
  [royaltyRecipientSystemType]: "System",
  [royaltyRecipientIndividualType]: "Individual",
};

export const addressUser = async (address) => {
  const { users } = await query(getUserByAddress, { address });
  return users.length ? users[0] : undefined;
};

export const addressLabel = async (address) => {
  const { users } = await query(getUserByAddress, { address });
  if (users.length) return users[0].username;
  return address.length > 6
    ? address.slice(0, 3) + ".." + address.slice(-3)
    : address;
};

export const assetLabel = async (asset) => {
  const { artworks } = await query(getArtworkByAsset, { asset });

  if (artworks.length) {
    let r = artworks[0];
    return r.title
      ? r.title + (r.editions > 1 ? ` ${r.edition}/${r.editions}` : "")
      : "Untitled";
  }
};

export const tickers = {
  [btc]: {
    name: "Liquid BTC",
    ticker: "L-BTC",
    precision: 8,
    decimals: 8,
  },
  [cad]: {
    name: "Liquid CAD",
    ticker: "L-CAD",
    precision: 8,
    decimals: 2,
  },
  [usd]: {
    name: "Liquid USDt",
    ticker: "L-USDt",
    precision: 8,
    decimals: 2,
  },
};

export const ticker = (asset) => {
  return asset
    ? tickers[asset]
      ? tickers[asset].ticker
      : asset.substr(0, 5)
    : "";
};

export const units = (asset) => {
  let decimals = 0;
  let precision = 0;
  if (tickers[asset]) ({ decimals, precision } = tickers[asset]);
  return [
    (val) => Math.round(val * 10 ** precision),
    (sats) => format(sats, precision, decimals),
    ticker(asset),
  ];
};

export const sats = (asset, val) => units(asset)[0](val);
export const val = (asset, sats) => units(asset)[1](sats);

export const goto = (path) => {
  svelteGoto(path);
  if (window) window.history.pushState(null, null, path);
};

export const explorer = import.meta.env.VITE_EXPLORER;

export const copy = (v) => {
  let textArea = document.createElement("textarea");
  textArea.style.position = "fixed";
  textArea.value = v;

  document.body.appendChild(textArea);

  textArea.focus();
  textArea.select();

  document.execCommand("copy");
  document.body.removeChild(textArea);

  info("Copied!");
};

export const pick = (obj, ...keys) =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));

export const err = (e) => {
  if (typeof e === "string") e = { message: e };
  error.set(e);
  let msg = e.message;
  try {
    msg = JSON.parse(msg).message;
  } catch {}
  try {
    msg = JSON.parse(msg).message;
  } catch {}
  if (!msg) msg = "An error occurred";
  if (msg.includes("EPIPE")) return;
  if (msg.includes("Insufficient")) return prompt.set(InsufficientFunds);
  if (msg.includes("socket")) return;
  if (msg.includes("JWT")) return;
  setTimeout(() => snack.set({ msg, type: "error" }), 100);
  if (e.stack) console.log(e.stack);
};

export const info = (msg) => {
  setTimeout(() => snack.set({ msg, type: "info" }), 100);
};

export const fullscreen = (elem) => {
  if (get(full)) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    full.set(false);
    return;
  }

  if (elem.requestFullscreen) {
    elem.requestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }

  full.set(true);
};

function format(n, p, d) {
  if (!parseInt(p)) return parseInt(n).toFixed(0);
  else {
    let x = n / 10 ** p;
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split("e-")[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = x.toFixed(9 - e);
        x = "0." + new Array(e).join("0") + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split("+")[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += new Array(e + 1).join("0");
      }
    }
    let r = x.toString().split(".")[1];

    if (r && r.length < 2 && d === 2) return x.toFixed(2);
    if (r > p && x.toFixed) return parseFloat(x.toFixed(p)).toString();
    return x;
  }
}

export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const go = ({ id, type, s }) => {
  let url = { user: "u", artwork: "artwork", tag: "tag" }[type];
  goto(`/${url}/${url === "artwork" ? id : encodeURIComponent(s)}`);
};

export const kebab = (str) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join("-");

export const etag = async (o) => {
  let d = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(JSON.stringify(o))
  );

  return Array.from(new Uint8Array(d))
    .map((a) => a.toString(16).padStart(2, "0"))
    .join("")
    .substring(0, 27);
};

export const dev = import.meta.env.DEV;

export const linkify = (text) => {
  var urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  return text.replace(urlRegex, function (url) {
    return '<a href="' + url + '">' + url + "</a>";
  });
};

function post(endpoint, data) {
  return fetch(endpoint, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data || {}),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const underway = ({ auction_start: s, auction_end: e }) =>
  e && isWithinInterval(new Date(), { start: parseISO(s), end: parseISO(e) });

export const canCancel = (
  { artwork, created_at, type, user: { id } },
  user
) => {
  return (
    type === "bid" && isCurrent(artwork, created_at, type) && user?.id === id
  );
};

export const isCurrent = ({ transferred_at: t }, created_at, type) =>
  type === "bid" && (!t || compareAsc(parseISO(created_at), parseISO(t)) > 0);

export const canAccept = ({ type, artwork, created_at, accepted }, user) => {
  if (accepted) return false;

  let isOwner = ({ owner }) => user && user.id === owner.id;

  let underway = ({ auction_start: s, auction_end: e }) =>
    e && isWithinInterval(new Date(), { start: parseISO(s), end: parseISO(e) });

  return (
    artwork &&
    isCurrent(artwork, created_at, type) &&
    isOwner(artwork) &&
    !underway(artwork)
  );
};

export function encrypt(privkey, pubkey, text) {
  pubkey = fromBase58(pubkey, network).publicKey.toString("hex").substring(2);

  var key = Buffer.from(
    nobleSecp256k1.getSharedSecret(privkey, "02" + pubkey, true)
  )
    .toString("hex")
    .substring(2);

  var iv = window.crypto.getRandomValues(new Uint8Array(16));
  var cipher = browserifyCipher.createCipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    iv
  );
  var encryptedMessage = cipher.update(text, "utf8", "base64");
  let emsg = encryptedMessage + cipher.final("base64");

  return emsg + "?iv=" + Buffer.from(iv.buffer).toString("base64");
}

export function decrypt(privkey, pubkey, ciphertext) {
  pubkey = fromBase58(pubkey, network).publicKey.toString("hex").substring(2);
  var [emsg, iv] = ciphertext.split("?iv=");
  var key = Buffer.from(
    nobleSecp256k1.getSharedSecret(privkey, "02" + pubkey, true)
  )
    .toString("hex")
    .substring(2);

  var decipher = browserifyCipher.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "base64")
  );
  var decryptedMessage = decipher.update(emsg, "base64");
  let dmsg = decryptedMessage + decipher.final("utf8");

  return dmsg;
}

export const updateBitcoinUnit = async (unit) => {
  try {
    let currentUser = get(user);

    if (currentUser) {
      const id = currentUser.id;
      const setUnit = { bitcoin_unit: unit };

      bitcoinUnitLocal.set(unit);
      await query(updateUser, { user: setUnit, id });
    } else {
      browser && window.localStorage.setItem("unit", unit);
      bitcoinUnitLocal.set(unit);
    }
  } catch (e) {
    err(e);
  }
};

export const updateFiats = async (fiat, action) => {
  try {
    let currentUser = get(user);

    if (currentUser) {
      const id = currentUser.id;
      let fiats = JSON.parse(currentUser.fiats);
      if (action === "add") {
        fiats.push(fiat);
      } else if (action === "remove") {
        if (fiats.length <= 1)
          return err("Must have at least one fiat currency selected");
        const currentIndex = fiats.indexOf(currentUser.fiat);
        if (currentUser.fiat === fiat) {
          currentUser.fiat =
            currentIndex === fiats.length - 1
              ? fiats[0]
              : fiats[currentIndex + 1];
        }
        fiats = fiats.filter((value) => value !== fiat);
      }
      const setFiats = { fiats: JSON.stringify(fiats), fiat: currentUser.fiat };
      currentUser.fiats = JSON.stringify(fiats);
      user.set(currentUser);
      await query(updateUser, { user: setFiats, id });
      if (action === "remove") {
        info("Fiat currency removed");
      } else if (action === "add") {
        info("Fiat currency added");
      }
    }
  } catch (e) {
    err(e);
  }
};

export const updateFiat = async () => {
  try {
    let currentUser = get(user);
    if (currentUser) {
      const fiats = JSON.parse(currentUser.fiats);
      if (currentUser && fiats.length > 1) {
        const id = currentUser.id;

        const currentIndex = fiats.indexOf(currentUser.fiat);

        currentUser.fiat =
          currentIndex === fiats.length - 1
            ? fiats[0]
            : fiats[currentIndex + 1];

        const setFiat = { fiat: currentUser.fiat };
        user.set(currentUser);

        await query(updateUser, { user: setFiat, id });
      }
    } else {
      let fiats = ["USD", "EUR", "JPY", "GBP", "CAD", "AUD", "CNY"];
      let i = fiats.indexOf(get(fiat));
      fiat.set(++i >= fiats.length ? fiats[0] : fiats[i]);
    }
  } catch (e) {
    err(e);
  }
};

export const satsFormatted = (amount) => {
  return new Intl.NumberFormat().format(amount);
};
